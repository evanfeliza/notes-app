import React, { useEffect, useState } from "react";
import useNoteList from "../GraphQl/useNoteList";
import useFilterList from "../GraphQl/useFilterList";
import SingleNote from "./SingleNote";
import { Oval } from "react-loader-spinner";

import { AiOutlineFilter } from "react-icons/ai";
import FilteredNote from "./FilteredNote";

export interface NotesProp {
  user: string;
}

const NoteList: React.FC<NotesProp> = ({ user }) => {
  const userID = user;

  const [filter, setFilter] = useState<boolean>(false);
  const [toggleList, setToggleList] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data: allNotesData,
    fetching: allNotesFetching,
    error: allNotesError,
    refetch: allRefetch,
  } = useNoteList(userID);
  const {
    data: filteredNotesData,
    fetching: filteredNotesFetching,
    error: filteredNotesError,
    refetch: filteredRefetch,
  } = useFilterList(userID, filter);

  const handleUnfinishedTask = () => {
    filteredRefetch();
    setFilter(false);
    setToggleList(false);
    setIsFilterOpen(false);
  };

  const handleFinishedTask = () => {
    filteredRefetch();
    setFilter(true);
    setToggleList(false);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    const { refetch: allRefetch } = useNoteList(userID);
    const handleNoFilter = () => {
      setToggleList(true);
      setIsFilterOpen(false);
    };
    allRefetch();

    return handleNoFilter();
  }, [allNotesData]);

  return (
    <main className="flex flex-col max-h-full h-[500px] max-w-full w-full overflow-y-auto bg-gradient-to-tr from-cyan-600 to-cyan-700 gap-1 px-4">
      <div className="z-50 relative flex justify-end items-center gap-2 sticky top-0 bg-cyan-800 px-5 py-2">
        <p className="font-semibold text-white">Filter</p>
        <button
          className="text-cyan-500 text-xl bg-white drop-shadow-lg rounded-full p-2 hover:bg-cyan-500 hover:text-white duration-700"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <AiOutlineFilter />
        </button>
        {isFilterOpen && (
          <ul className="bg-white absolute top-10 right-5 rounded-md drop-shadow divide-y divide-y-1 divide-cyan-500 duration-500 overflow-hidden">
            <li
              className="cursor-pointer px-4 py-1 hover:bg-slate-300 active:bg-cyan-500"
              onClick={handleUnfinishedTask}
            >
              Unfinished Tasks
            </li>
            <li
              className="cursor-pointer px-4 py-1 hover:bg-slate-300 active:bg-cyan-500"
              onClick={handleFinishedTask}
            >
              Finished Tasks
            </li>
            <li
              className="cursor-pointer px-4 py-1 hover:bg-slate-300 active:bg-cyan-500"
              onClick={() => setToggleList(true)}
            >
              No Filters
            </li>
          </ul>
        )}
      </div>
      <ul className="w-full h-full divide-y divide-y-1">
        {allNotesFetching || filteredNotesFetching ? (
          <span className="flex items-center justify-center h-full w-full">
            <Oval
              height={45}
              width={45}
              color="cyan"
              secondaryColor="white"
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              strokeWidth={7}
            />
          </span>
        ) : toggleList ? (
          <SingleNote notes={allNotesData?.todos} />
        ) : (
          <FilteredNote notes={filteredNotesData?.todosOfUserByStatus} />
        )}
      </ul>
    </main>
  );
};

export default NoteList;
