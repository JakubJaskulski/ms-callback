### Azure Authentication - Service Principal

**Step 1: Create Service Principal via Azure Portal**
1. Go to **Azure Portal** → **Microsoft Entra ID (Active Directory)** → **App registrations** → **New registration**
2. Name: `terraform-service-principal`
3. After creation, go to **Client credentials** → **Add a certificate or secret** → **New client secret**
4. Copy the **Application (client) ID**, **Directory (tenant) ID**, and **client secret**
5. Go to **Azure Portal** → **Subscriptions**
6. Copy the **Subscription ID**

**Step 2: Assign Permissions**

Go to your service principal → **Manage** → **API permissions** → **Add a permission**
1. Select **Microsoft Graph** → **Application permissions**
2. Add these permissions:
   - `Application.ReadWrite.All`
   - `Directory.ReadWrite.All`
3. Click **Grant admin consent for Default Directory** 

**Step 3: Configure Environment Variables**
1. Copy .env
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` with your values:

**Step 4: Load Environment Variables**
```bash
# Load environment variables before running Terraform
export $(cat .env | grep -E '^ARM_' | xargs)
```

### Terraform

```bash
terraform init
terraform plan
terraform apply
```

### Get the Application Credentials

After successful deployment, get the application credentials for `.env` from Terraform output:

```bash
terraform output application_id
terraform output tenant_id
terraform output -raw client_secret
```

### Run Your Node.js Application

```bash
node index.js
```

### Test OAuth2 Flow
1. Run the app
   ```bash
   node index.js
   ```
2. Open `http://localhost:3000` in your browser
3. Clink on "Login with Microsoft"
4. Consent to the permissions
5. You should see your access token in browser and console
