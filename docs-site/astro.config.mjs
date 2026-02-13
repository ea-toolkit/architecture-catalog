// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Architecture Catalog',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/ea-toolkit/architecture-catalog' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Project Structure', slug: 'getting-started/project-structure' },
					],
				},
				{
					label: 'Modeling Your Architecture',
					items: [
						{ label: 'Registry Mapping', slug: 'modeling/registry-mapping' },
						{ label: 'Adding Elements', slug: 'modeling/adding-elements' },
						{ label: 'Relationships', slug: 'modeling/relationships' },
						{ label: 'Domains', slug: 'modeling/domains' },
					],
				},
				{
					label: 'Configuration',
					items: [
						{ label: 'registry-mapping.yaml Reference', slug: 'configuration/mapping-reference' },
						{ label: 'Site Branding', slug: 'configuration/branding' },
						{ label: 'Layers & Types', slug: 'configuration/layers-and-types' },
					],
				},
				{
					label: 'Architecture',
					items: [
						{ label: 'How It Works', slug: 'architecture/how-it-works' },
						{ label: 'Data Pipeline', slug: 'architecture/data-pipeline' },
						{ label: 'Extending the UI', slug: 'architecture/extending' },
					],
				},
				{
					label: 'Developer Tools',
					items: [
						{ label: 'Validation', slug: 'tools/validation' },
						{ label: 'Dashboard Generator', slug: 'tools/dashboard' },
						{ label: 'Claude Skills', slug: 'tools/claude-skills' },
					],
				},
				{
					label: 'Deployment',
					items: [
						{ label: 'Build & Deploy', slug: 'deployment/build-and-deploy' },
					],
				},
				{
					label: 'Contributing',
					items: [
						{ label: 'How to Contribute', slug: 'contributing/how-to-contribute' },
					],
				},
			],
		}),
	],
});
