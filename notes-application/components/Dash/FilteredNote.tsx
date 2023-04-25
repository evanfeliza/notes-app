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

const FilteredNote: React.FC<NotesProp> = ({ notes }) => {


  return (
    <React.Fragment>
      { ( notes?.map((note: Note, index) => (
              
              <li
                key={index}
                className={`${note.done && `bg-slate-700 opacity-50`}cursor-pointer truncate max-w-full w-full grid items-center grid-cols-4 min-h-[100px] h-auto from-cyan-500 to-cyan-600 hover:bg-cyan-300 active:bg-cyan-500 duration-500 py-2`}
              >
                <div
                  className={`${note.done && `pointer-events-none`} flex items-center p-2 col-span-3`} 
                >
                  <p className="text-xl leading-6 text-white font-semibold text-ellipsis overflow-hidden">
                    {note.task}
                   
                  </p>
                  
                </div>
                 
                <div className='flex flex-col gap-2  md:flex-row items-center justify-center md:bg-white mx-auto h-auto rounded-full p-2'>
                  <div 
                      className='bg-white text-cyan-500 text-[25px] rounded-full active:bg-cyan-900 active:bg-opacity-10 hover:bg-cyan-900 hover:bg-opacity-[0.05] p-2 duration-700'  
                    >
                     { note.done 
                     ? 
                        <ImCheckboxChecked/>
                     :
                        <ImCheckboxUnchecked/>
                     }
                  </div>
                </div>
              </li>
           ))
        )
        }
      </React.Fragment>
  );
};

export default FilteredNote;
