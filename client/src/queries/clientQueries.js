// we took the queries out of the components and put them here
import { gql } from "@apollo/client"
const GET_CLIENTS = gql`
  query GetClients {
    clients {
        id,
        name,
        email,
        phone
      }
    }
`
//we do not want to export as default because we are going to have more than one query
export { GET_CLIENTS };