

const queries = {
  accountBalances: () => {
    return {
  account(id: "151837") {
    address
    ... on User {
      id
      address
      balances {
        balance
        token {
          name
          symbol
          decimals
          address
        }
      }
    }
  }
}
  }
}
