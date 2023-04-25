import {gql , useQuery } from 'urql'

const GET_USER = gql `
  query getUser($id:String!){
    user(id: $id) {
      id,
      name,
    }
  }

` 

const useUser = (id:String) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_USER,
    variables: {
      id,
    },
  });

  const { fetching, data, error } = result;
  return { fetching, data, error };
}

export default useUser