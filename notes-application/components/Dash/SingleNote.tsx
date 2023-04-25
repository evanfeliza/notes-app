import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal'
import { useForm, SubmitHandler ,Controller } from 'react-hook-form'
import { useMutation} from 'urql'
import { DELETE_TODO, UPDATE_TODO, UPDATE_TODO_DONE } from '../GraphQl/Mutation';
import useNoteList from '../GraphQl/useNoteList';
import { useRouter } from 'next/router';
import { Oval } from 'react-loader-spinner';
import { AiOutlineDelete ,AiOutlineCheckSquare, } from "react-icons/ai";
import  {ImCheckboxUnchecked ,ImCheckboxChecked } from "react-icons/im"


export interface Note {
  id: string;
  task: string;
  done: boolean;
  userID: string;
}

export interface NotesProp {
  notes: Note[];
}

interface Edit { 
  notes: {
    task: string,
    done: boolean
  }[],
  editNote: string,
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 3,
};

const SingleNote: React.FC<NotesProp> = ({ notes }) => {
  const router = useRouter()
  const {  register, setValue, handleSubmit} = useForm<Edit>()
  const [ updateTodoResult ,updateTodo ] = useMutation(UPDATE_TODO)
  const [ updateTodoDoneResult ,updateTodoDone ] = useMutation(UPDATE_TODO_DONE)  
  const [ deleteTodoResult ,deleteTodo ] = useMutation(DELETE_TODO)  
  const [ idEdit  , setIdEdit] = useState<string>()  
  const [ isEdit , setIsEdit] = useState(false)

  
  
  const {  refetch  } = useNoteList(router.query.user as string)
 

 


  const handleOpen= ( index: number) => {
    setValue('editNote',`${notes[index].task}`)
    setIdEdit(`${notes[index].id}`)
    setIsEdit(true)
    
  }
  const handleClose = () => {
    setIsEdit(false)
  }
  

  const handleTask = async (index: number) => { 
    const taskDone = notes[index]?.done
    const idTaskDone = notes[index]?.id;
    
    try {
      await updateTodoDone({ id: idTaskDone as string, done: !taskDone });
      refetch()
    } catch(error) {
      console.log(error);
    }
    
  }


  const handleDeleteNote = async (index: number) => {

    const idTaskDelete = notes[index]?.id;
    try {
      await deleteTodo({ id: idTaskDelete as string});
      refetch()
    } catch(error) {
      console.log(error);
    }
  
  }

  
  const onSubmitEdit: SubmitHandler<Edit> = async (data) => {

    try{
      await updateTodo({id: idEdit, task: data.editNote}); 
      refetch()
    }catch(error){
    console.log(error)
   }
    handleClose();
  };




  return (
    <React.Fragment>
      {
        !updateTodoResult.fetching
        && ( notes?.map((note: Note, index) => (
              
              <li
                key={index}
                className={`${note.done && `bg-slate-700 opacity-50`}cursor-pointer truncate max-w-full w-full grid items-center grid-cols-4 min-h-[100px] h-auto from-cyan-500 to-cyan-600 hover:bg-cyan-300 active:bg-cyan-500 duration-500 py-2`}
              >
                <div
                  onClick={() => handleOpen(index as number)}
                  className={`${note.done && `pointer-events-none`} flex items-center p-2 col-span-3`} 
                >
                  <p className="text-xl leading-6 text-white font-semibold text-ellipsis overflow-hidden">
                    {note.task}
                   
                  </p>
                  
                </div>
                 
                <div className='drop-shadow-md flex flex-col gap-2  md:flex-row items-center justify-center md:bg-white md:mx-auto h-auto rounded-full px-2'>
                  <button 
                      onClick={(e) => { handleTask(index as number)}}
                      className='bg-white text-cyan-500 text-[25px] rounded-full active:bg-cyan-900 active:bg-opacity-10 hover:bg-cyan-900 hover:bg-opacity-[0.05]  p-2 duration-700'  
                    >
                     { note.done 
                     ? 
                        <ImCheckboxChecked/>
                     :
                        <ImCheckboxUnchecked/>
                     }
                  </button>
    
                  <button
                    onClick={(e) => { handleDeleteNote(index as number)}}
                    className='text-cyan-500 text-[35px] bg-white rounded-full active:bg-cyan-900 active:bg-opacity-10 hover:bg-cyan-900 hover:bg-opacity-[0.05]  p-1 duration-700'  
                  >
                    <AiOutlineDelete/>
                  </button>
                </div>
              </li>
           ))
        )
        }
        <Modal
          open={isEdit}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="focus:outline-none bg-gradient-to-br drop-shadow-lg rounded-md from-cyan-500 to-cyan-400 w-[90vw] h-[90vh] md:w-4/5 md:h-2/3" sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <span className="font-semibold text-white">Edit your Note</span>
            </Typography>
            <form onSubmit={handleSubmit(onSubmitEdit)} className="flex flex-col gap-4 bg-inherit w-full h-[90%]">
              <textarea className="p-4 bg-inherit focus:outline focus:outline-1 text-white focus:outline-white resize-none w-full h-full" {...register("editNote")} />
              <button className="focus:outline-none outline-cyan-300 bg-white p-4 rounded-md" type="submit">
              {updateTodoResult.fetching
               ? (<span className='flex items-center justify-center h-full w-full'>
                    <Oval
                    height={25}
                    width={25}
                    color="cyan"
                    secondaryColor='white'
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    strokeWidth={7}
                    />  
                  </span>) 
              : (<span className='mx-auto'>
                  Save
                </span>)}
              </button>
            </form>
           
          </Box>
        </Modal>
      </React.Fragment>
  );
};

export default SingleNote;
