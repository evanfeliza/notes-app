import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql';
import { CREATE_TODO } from '../GraphQl/Mutation';
import useNoteList from '../GraphQl/useNoteList';
import { IoIosAddCircle } from "react-icons/io"


interface TaskForm {
  content: string;
}
interface AddTask{
  addTask:boolean
}

const InputNote:React.FC<AddTask> = ( {addTask} ) => {
  const [ isAdd , setIsAdd ] = useState(addTask)
  const { register, reset , handleSubmit } = useForm<TaskForm>()
  const [createTodoResult , createTodo] = useMutation(CREATE_TODO)
  
  const router = useRouter()
  const { refetch } = useNoteList(router.query.user as string)
  
  const onAddTask = async (data: TaskForm) => {
    try {
      await createTodo({ task: data.content, userId: router.query.user });
      reset()
      refetch()
      } catch (error) {
      console.error(error);
    }
  }

  return (
  <React.Fragment>
    {isAdd && 
      <form 
      onSubmit={handleSubmit(onAddTask)}
      className='min-h-full w-full p-4 flex relative'
      >
        <textarea 
          className='h-full placeholder-white w-full text-white resize-none bg-inherit p-4 focus:outline-white focus:outline focus:outline-1'
          placeholder='add a task..' id='content' {...register('content', { required: true })}>
        </textarea>


        <button className="flex gap-1 items-center h-full absolute top-[-4px] right-5 " type='submit'>
          <span className='text-[4rem] text-white hover:drop-shadow-md hover:text-cyan-200 active:text-white duration-500'>
            <IoIosAddCircle/>            
          </span>
        </button>
      </form>
    }
  </React.Fragment>
    
  )
}

export default InputNote
