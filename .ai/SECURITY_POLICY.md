# Security Policy

## Critical Rules
- NEVER output or request `.env` and `example.env` file contents
- NEVER hardcode API credentials, secret tokens, private keys or passwords in source code
- NEVER send sensitive user data to external AI services
- Follow `.aiignore` and `.gitignore` for excluded files

## Data Privacy
- When asking for help, sanitize data (replace real IDs, emails, tokens with placeholders)
- Do not log sensitive information
