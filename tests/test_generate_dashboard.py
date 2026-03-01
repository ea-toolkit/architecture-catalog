"""Tests for scripts/generate_dashboard.py — pure function tests.

Tests cover domain stats and layer stats calculation using
the sample_registry_elements fixture from conftest.py.
"""

import generate_dashboard as gd


# ── calculate_domain_stats() ──────────────────────────────────


class TestCalculateDomainStats:
    """calculate_domain_stats groups elements by domain."""

    def test_counts_per_domain(self, sample_registry_elements):
        stats = gd.calculate_domain_stats(sample_registry_elements)
        assert stats["customer-management"]["total"] == 3
        assert stats["billing-and-payments"]["total"] == 1
        assert stats["analytics-and-insights"]["total"] == 1

    def test_by_layer_breakdown(self, sample_registry_elements):
        stats = gd.calculate_domain_stats(sample_registry_elements)
        cm = stats["customer-management"]
        assert cm["by_layer"]["application"] == 2
        assert cm["by_layer"]["technology"] == 1

    def test_by_type_breakdown(self, sample_registry_elements):
        stats = gd.calculate_domain_stats(sample_registry_elements)
        cm = stats["customer-management"]
        assert cm["by_type"]["components"] == 1
        assert cm["by_type"]["functions"] == 1

    def test_owner_count(self, sample_registry_elements):
        stats = gd.calculate_domain_stats(sample_registry_elements)
        cm = stats["customer-management"]
        assert cm["owner_count"] == 2  # Team A and Platform

    def test_sourcing_counts(self, sample_registry_elements):
        stats = gd.calculate_domain_stats(sample_registry_elements)
        cm = stats["customer-management"]
        assert cm["in_house_count"] == 2  # Order Service + User Management
        assert cm["vendor_count"] == 0

    def test_empty_list(self):
        stats = gd.calculate_domain_stats([])
        assert stats == {}


# ── calculate_layer_stats() ───────────────────────────────────


class TestCalculateLayerStats:
    """calculate_layer_stats groups elements by layer."""

    def test_counts_per_layer(self, sample_registry_elements):
        stats = gd.calculate_layer_stats(sample_registry_elements)
        assert stats["application"]["total"] == 4
        assert stats["technology"]["total"] == 1

    def test_by_type_within_layer(self, sample_registry_elements):
        stats = gd.calculate_layer_stats(sample_registry_elements)
        app = stats["application"]
        assert app["by_type"]["components"] == 3
        assert app["by_type"]["functions"] == 1

    def test_empty_list(self):
        stats = gd.calculate_layer_stats([])
        assert stats == {}
