import { gql} from '@urql/core';
import { useQuery } from 'urql';

const FILTER_TODO = gql`
  query FilterTodos($userID: String!, $done: Boolean!) {
    todosOfUserByStatus(userId: $userID, done: $done) {
      id
      task
      done
      userID
    }
  }
`;

export default function useFilterList(userID: string, done: boolean) {
  const [{ fetching, data, error }, refetch] = useQuery({
    query: FILTER_TODO,
    variables: {
      userID,
      done,
    },
  });

  return {data , fetching, error ,refetch}
}
