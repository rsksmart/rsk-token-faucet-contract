<p align="middle">
    <img src="https://www.rsk.co/img/rsk_logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle">RSK Token Faucet Contract</h3>
<p align="middle">
    <a href="https://github.com/rsksmart/rsk-token-faucet-contract/actions/workflows/ci.yml" alt="ci">
        <img src="https://github.com/rsksmart/rsk-token-faucet-contract/actions/workflows/ci.yml/badge.svg" alt="ci" />
    </a>
    <a href='https://coveralls.io/github/rsksmart/rsk-token-faucet-contract?branch=master'>
        <img src='https://coveralls.io/repos/github/rsksmart/rsk-token-faucet-contract/badge.svg?branch=master' alt='Coverage Status' />
    </a>
    <br />
    <a href="https://lgtm.com/projects/g/rsksmart/rsk-token-faucet-contract/alerts/">
        <img src="https://img.shields.io/lgtm/alerts/github/rsksmart/rsk-token-faucet-contract" alt="alerts">
    </a>
    <a href="https://lgtm.com/projects/g/rsksmart/rsk-token-faucet-contract/context:javascript">
        <img src="https://img.shields.io/lgtm/grade/javascript/github/rsksmart/rsk-token-faucet-contract">
    </a>
</p>

Use the RSK Faucet to get any of your favourite tokens in the RSK Testnet.

Features:
- You can only dispense once a day
- Owner can modify this time and the dispensed value

Additional: you can use `BalanceFetcher` to get the balance of many tokens for a given account

## Run for development

Install dependencies:

```sh
npm i
```

### Run unit tests

```sh
npx truffle test
```

Coverage report with:

```sh
npx truffle run coverage
```


### Branching model

- `main` has latest release. Merge into `main` will deploy to npm. Do merge commits.
- Use branches pointing to `main` to add new PRs.
- Do external PRs against latest commit in `main`.

### Deploy

First, create a `.secret` file with a mnemonic phrase. You will need to fund the account. Then run:

```sh
npx truffle migrate --network rskTestnet
```

## Deployments

**TokenFaucet address**: [`0xEA184604347fD5CedE89217E1Ab1eed322C8c98b`](https://explorer.testnet.rsk.co/address/0xea184604347fd5cede89217e1ab1eed322c8c98b)

**BalanceFetcher address**: [`0x5CAD4A45f86E35bf130DeD4eCE450867F9ee7cFe`](https://explorer.testnet.rsk.co/address/0x5cad4a45f86e35bf130ded4ece450867f9ee7cfe)

