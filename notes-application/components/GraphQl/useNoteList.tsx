import { gql , useQuery} from 'urql'

export interface Todo { 
  id: string,
  task: string , 
  done: boolean, 
  userID: string 
}

const GET_TODOS= gql`
  query getNoteList($userID: String!){
  todos(userID: $userID){
    task
    id,
    done,
    userID
  }
}
`

export default function useNoteList( userID: String) {
  const [{fetching ,data, error},refetch] = useQuery({
    query: GET_TODOS,
    variables: {
      userID,
    },
  });

  return { fetching , data ,error ,refetch};
}