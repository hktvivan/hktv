# HKTVITLO Confluence Access

> **TO THE NEXT AGENT: Before doing anything with this document, you MUST enter Plan Mode.**
> Present a plan to your owner covering: what you intend to do, which files you will touch,
> and how you will verify the result. **Do not execute until your owner approves.**
> Follow the Planning & Execution Protocol: Analysis → Proposed Changes → Verification.

## Variables

Before using this document, **replace all `${VARIABLE}` placeholders below with your own values**.

| Variable | Description | Example |
|---|---|---|
| `${ATLASSIAN_EMAIL}` | Your Atlassian account email | `someone@company.com` |
| `${ATLASSIAN_USERNAME}` | Short username (usually email prefix) | `someone` |
| `${KEEPASS_DB_DIR}` | Directory containing the KeePass DB file | `C:\Users\someone\Desktop\` |
| `${KEEPASS_DB_FILENAME}` | KeePass database filename | `AI_Access_Tokens.kdbx` |
| `${KEEPASS_ENTRY_NAME}` | KeePass entry for this Atlassian site | `Atlassian Confluence HKTVITLO` |

**Defaults (no need to change unless your setup differs):**
- Secret store key: `AI-AccessTokens-DB`
- Secret store vault: `LocalStore`

## Credential Security Rules

When working with credentials (username, password, tokens, API keys), agents must ONLY use one of these two approaches:

- **Broker**: Retrieve credentials through a credential broker or secret manager (e.g., Microsoft Secret Store, KeePassXC) — never hardcode or inline them.
- **Proxy**: Pass credentials to commands exclusively via pipe (`|`) — e.g., `Get-Secret -Name "X" | some-command`. Never pass credentials as command-line arguments, environment variables, or inline in scripts.
- **Never** embed credentials in source code, config files, scripts, command-line arguments, or chat output.

## Setup: Microsoft Secret Store

If the Secret Store is not yet configured on your machine, run the following in PowerShell (as admin):

```powershell
# 1. Install the required modules
Install-Module Microsoft.PowerShell.SecretManagement -Scope CurrentUser
Install-Module Microsoft.PowerShell.SecretStore -Scope CurrentUser

# 2. Register the LocalStore vault
Register-SecretVault -Name LocalStore -ModuleName Microsoft.PowerShell.SecretStore

# 3. Store the KeePass DB master password
#    You will be prompted to enter the password securely
Set-Secret -Name 'AI-AccessTokens-DB' -Vault LocalStore
```

Verify with: `Get-SecretInfo -Vault LocalStore`

## Setup: KeePassXC

1. Install KeePassXC from https://keepassxc.org/download/
2. Create a new database, save as `${KEEPASS_DB_DIR}${KEEPASS_DB_FILENAME}`
3. Add an entry:
   - **Title:** `${KEEPASS_ENTRY_NAME}`
   - **Username:** `${ATLASSIAN_EMAIL}`
   - **Password:** your Atlassian API token
4. Verify CLI access:
   ```powershell
   & 'C:\Program Files\KeePassXC\keepassxc-cli.exe' --version
   ```

## Before Every Step

> **YOU MUST DO THIS BEFORE ANY ACTION:**
> Tell your owner: *"Please provide your values for the following variables so I can access Confluence:*
> - *Your Atlassian email (`${ATLASSIAN_EMAIL}`)*
> - *Your short username (`${ATLASSIAN_USERNAME}`)*
> - *Your KeePass DB directory (`${KEEPASS_DB_DIR}`)*
> - *Your KeePass DB filename (`${KEEPASS_DB_FILENAME}`)*
> - *Your KeePass entry name (`${KEEPASS_ENTRY_NAME}`)*
>
> *Or confirm you want to use the defaults for the KeePass entry name and filename."*
>
> Do **not** proceed with any API calls until the owner has supplied their values.

## Credentials

- **Username:** `${ATLASSIAN_EMAIL}`
- **API Token:** Retrieved from Windows Secret Store (secret name: `AI-AccessTokens-DB`, vault: `LocalStore`)
- **KeePass Database:** `${KEEPASS_DB_DIR}${KEEPASS_DB_FILENAME}`
- **KeePass Entry:** `${KEEPASS_ENTRY_NAME}`

## How to Retrieve the API Token

```powershell
$dbPass = Get-Secret -Name 'AI-AccessTokens-DB' -AsPlainText -Vault LocalStore
$dbPath = (Get-ChildItem -Path '${KEEPASS_DB_DIR}' -Filter '${KEEPASS_DB_FILENAME}' -Recurse).FullName
$dbPass | & 'C:\Program Files\KeePassXC\keepassxc-cli.exe' show -s -a Password $dbPath "${KEEPASS_ENTRY_NAME}"
```

## API Details

- **Base URL:** https://hongkongtv.atlassian.net
- **Jira API (v3):** `/rest/api/3/`
- **Confluence API (v2):** `/wiki/api/v2/`

## Working curl Commands

### Test Authentication (Jira)
```bash
curl -s -u "${ATLASSIAN_EMAIL}:<API_TOKEN>" "https://hongkongtv.atlassian.net/rest/api/3/myself"
```

### List Confluence Spaces
```bash
curl -s -u "${ATLASSIAN_EMAIL}:<API_TOKEN>" "https://hongkongtv.atlassian.net/wiki/api/v2/spaces?limit=10" | python3 -m json.tool
```

## Confluence Spaces Available

| Key | Name | Status |
|-----|------|--------|
| HKTV | HKTV Initial Project Space | current |
| HKTVAD | HKTV-AD | current |
| HKTVLOG | HKTV-LOG | current |
| SPECDOCS | SPEC Documents | current |
| HKTVIT | HKTVIT | current |
| HKTVEXP | HKTV-LE | current |
| HKTVGP | Hokobuy | current |
| SF | Salesforce | current |
| PLAY | ITE Playground | archived |
| HU | HKTVmall Upgrade | current |
| DATA | DATA BANK | current |
| HKTVPAY | HKTVpay | current |
| HKTVQA | QA Documents | current |
| IB | International Business | current |

## Notes

- This is a **generic template**. All `${VARIABLE}` placeholders must be replaced with real values before use.
- The "HKTVITLO" entry name in KeePass maps to the HKTVITLO Atlassian site at `hongkongtv.atlassian.net`
- Jira REST API v2 (`/rest/api/2/`) does not work — must use v3 (`/rest/api/3/`)
- Confluence API v1 (`/wiki/rest/api/`) returns 403 — must use v2 (`/wiki/api/v2/`)
- Password (API token) is stored in Windows Secret Management SecretStore for secure, non-interactive retrieval
