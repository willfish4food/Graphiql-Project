import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Project from "./pages/Project";

const client = new ApolloClient({ 
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
 });

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:id" element={<Project />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
/*
This is how you would update the cache instead of refetchingQueries in ClientRow
const cache = new InMemoryCache({
  typePolicy: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});
*/