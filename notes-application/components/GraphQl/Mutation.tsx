import { gql, useMutation , } from 'urql'

export interface Todo {
  id: number,
  task: string , 
  done: boolean ,
  userID: String 
}


export const CREATE_USER = gql`
  mutation CreateUser($id: String!, $name: String!) {
    createUser(input: { id: $id, name: $name }) {
      id
      name
    }
  }
`;

export const DELETE_USER = gql`
mutation DeleteUser($id: ID!){
  deleteUser(id:$id){
    id
  }
}
`
export const CREATE_TODO =gql`
  mutation CreateTodo($task: String!, $userId: String!){
  createTodo( input:{task: $task, userId:$userId} ){
  	id
    task
    done
    userID
  }
}
`
export const UPDATE_TODO = gql`
mutation UpdateTodo($id: ID! , $task: String!){
	updateTodoTask( input: {id: $id, task: $task} ){
    id,
    task
  }
}`


export const UPDATE_TODO_DONE =gql`
mutation UpdateTodoDone($id: ID! , $done: Boolean!) {
	updateTodoDone( input: {id: $id, done: $done} ){
    id,
    done
  }
}
`
export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!){
    deleteTodo(id: $id){
      id
      done
      task
      userID 
    }
  }
`

