# CLI Workflow

```bash
# Install package only
npx @nestp/awsx install

# Generate awsx.config.json only
npx @nestp/awsx init

# Install + guided config setup
npx @nestp/awsx setup
```

The `setup` flow asks for:
- package manager
- services to configure
- global vs per-service credentials
- s3 default bucket (optional)
- output config path
