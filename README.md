# 🔴 MyOffMode — myoffmode.com

> Activate your OFF Mode. The home handles itself.

## Démarrage rapide (5 étapes)

### 1. Installe Node.js
https://nodejs.org → version LTS → installe

### 2. Installe les dépendances
```bash
cd myoffmode
npm install
cp .env.local.example .env.local
```

### 3. Configure Supabase
1. https://supabase.com → New Project "myoffmode"
2. SQL Editor → New query → colle `supabase/schema.sql` → Run
3. Authentication → Providers → Active Google OAuth
4. Settings → API → copie URL + Anon Key dans `.env.local`

### 4. Configure Anthropic
1. https://console.anthropic.com → API Keys → Create
2. Copie dans `.env.local` → `ANTHROPIC_API_KEY`

### 5. Configure Stripe
1. https://dashboard.stripe.com → Products → "MyOffMode Pro" → 7€/mois
2. Copie Price ID + Secret Key dans `.env.local`

### Lance !
```bash
npm run dev
# → http://localhost:3000
```

## Déployer sur Vercel
1. Push sur GitHub
2. https://vercel.com → New Project → importe le repo
3. Ajoute les variables d'environnement
4. Deploy → myoffmode.com est live !

## Structure
```
myoffmode/
├── src/app/
│   ├── page.tsx           ← Landing page
│   ├── login/             ← Auth Google/Apple  
│   ├── onboarding/        ← Formulaire maman 4 étapes
│   ├── dashboard/         ← Dashboard + OFF Mode button
│   ├── upgrade/           ← Stripe Premium 7€/mois
│   └── api/
│       ├── chat/          ← IA avec mémoire famille
│       └── stripe/        ← Paiement
├── src/components/
│   ├── ChatModal.tsx      ← Chat IA
│   └── GroceryList.tsx    ← Liste de courses
└── supabase/schema.sql    ← Toutes les tables DB
```

## Pour ajouter des features — Claude Code
```bash
claude
```
> "Je travaille sur MyOffMode (myoffmode.com).
> Stack : Next.js 14, Supabase, API Claude Anthropic, Stripe, Tailwind.
> Je veux ajouter [ta feature]..."

