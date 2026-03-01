"""Tests for scripts/init_registry.py.

Each test uses a minimal mapping YAML written to a temp directory,
monkeypatches REPO_ROOT so init_registry writes into tmp_path,
and verifies the generated folder structure and _template.md files.
"""

from pathlib import Path
from unittest.mock import patch

import yaml

import sys
# Add scripts/ to path so we can import init_registry
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

import init_registry as ir


def _run_init(tmp_path: Path, mapping_file: Path, dry_run: bool = False):
    """Helper: run init_registry with REPO_ROOT pointed at tmp_path."""
    with patch.object(ir, "REPO_ROOT", tmp_path):
        ir.init_registry(mapping_file, dry_run=dry_run)


class TestCreatesFoldersAndTemplates:
    """init_registry creates folders and _template.md for each element type."""

    def test_folders_created(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        assert (tmp_path / "test-registry" / "1-business" / "services").is_dir()
        assert (tmp_path / "test-registry" / "2-application" / "components").is_dir()

    def test_templates_created(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        svc_template = tmp_path / "test-registry" / "1-business" / "services" / "_template.md"
        comp_template = tmp_path / "test-registry" / "2-application" / "components" / "_template.md"

        assert svc_template.is_file()
        assert comp_template.is_file()

    def test_template_contains_type_key(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        svc_content = (tmp_path / "test-registry" / "1-business" / "services" / "_template.md").read_text()
        assert 'type: "service"' in svc_content

        comp_content = (tmp_path / "test-registry" / "2-application" / "components" / "_template.md").read_text()
        assert 'type: "component"' in comp_content

    def test_template_contains_fields(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        comp_content = (tmp_path / "test-registry" / "2-application" / "components" / "_template.md").read_text()
        assert "name:" in comp_content
        assert "description:" in comp_content
        assert "owner:" in comp_content
        assert "status:" in comp_content

    def test_template_contains_relationships(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        comp_content = (tmp_path / "test-registry" / "2-application" / "components" / "_template.md").read_text()
        assert "composes_services:" in comp_content
        assert "Composes" in comp_content  # verb from relationship_types

    def test_template_contains_archimate(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        svc_content = (tmp_path / "test-registry" / "1-business" / "services" / "_template.md").read_text()
        assert "archimate_type: business-service" in svc_content


class TestIdempotent:
    """Re-running init_registry does not overwrite real data files."""

    def test_data_file_untouched(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        # Create a "real" data file in the services folder
        data_file = tmp_path / "test-registry" / "1-business" / "services" / "my-service.md"
        data_file.write_text("---\nname: My Service\n---\n")

        # Run init again
        _run_init(tmp_path, mapping_file)

        # Data file should be untouched
        assert data_file.read_text() == "---\nname: My Service\n---\n"

    def test_template_is_overwritten(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        template = tmp_path / "test-registry" / "1-business" / "services" / "_template.md"
        original_content = template.read_text()

        # Corrupt the template
        template.write_text("corrupted")

        # Run init again — template should be regenerated
        _run_init(tmp_path, mapping_file)
        assert template.read_text() == original_content


class TestDryRun:
    """dry_run=True prints but creates nothing on disk."""

    def test_no_folders_created(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file, dry_run=True)

        assert not (tmp_path / "test-registry" / "1-business" / "services").exists()
        assert not (tmp_path / "test-registry" / "2-application" / "components").exists()

    def test_no_templates_created(self, tmp_path, mapping_file):
        # Pre-create the folders so we can check templates specifically
        (tmp_path / "test-registry" / "1-business" / "services").mkdir(parents=True)
        _run_init(tmp_path, mapping_file, dry_run=True)

        assert not (tmp_path / "test-registry" / "1-business" / "services" / "_template.md").exists()


class TestMissingFolderSkipped:
    """Elements without a folder field are skipped without error."""

    def test_skips_element_without_folder(self, tmp_path, minimal_mapping):
        # Add an element with no folder
        minimal_mapping["elements"]["orphan"] = {
            "label": "Orphan Type",
            "layer": "business",
            "fields": {"name": {"type": "string", "required": True, "label": "Name"}},
        }

        mapping_path = tmp_path / "models" / "registry-mapping.yaml"
        mapping_path.parent.mkdir(parents=True, exist_ok=True)
        with open(mapping_path, "w") as f:
            yaml.dump(minimal_mapping, f, default_flow_style=False)

        # Should not raise
        _run_init(tmp_path, mapping_path)

        # Other folders should still be created
        assert (tmp_path / "test-registry" / "1-business" / "services").is_dir()


class TestReadmeCreated:
    """A README.md is created at the registry root with layer names."""

    def test_readme_exists(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        readme = tmp_path / "test-registry" / "README.md"
        assert readme.is_file()

    def test_readme_contains_layers(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        readme_content = (tmp_path / "test-registry" / "README.md").read_text()
        assert "Business" in readme_content
        assert "Application" in readme_content

    def test_readme_not_overwritten(self, tmp_path, mapping_file):
        _run_init(tmp_path, mapping_file)

        readme = tmp_path / "test-registry" / "README.md"
        readme.write_text("custom readme")

        # Run again — should NOT overwrite
        _run_init(tmp_path, mapping_file)
        assert readme.read_text() == "custom readme"
