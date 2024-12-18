"use client";

import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define the type of the item being dragged
interface Shift {
  start: string;
  end: string;
}

interface Employee {
  name: string;
  shifts: { [key: string]: Shift[] };
}

interface DragItem {
  shift: Shift;
  employeeName: string;
  day: string;
}

const Calendar: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      name: "Alexandre Timmermans",
      shifts: {
        Mon: [
          { start: "07:00", end: "15:00" },
          { start: "16:00", end: "21:00" },
        ],
        Tue: [{ start: "08:30", end: "17:00" }],
      },
    },
    {
      name: "Elise Leroy",
      shifts: { Mon: [{ start: "08:00", end: "17:00" }] },
    },
    {
      name: "Samuel Goossens",
      shifts: { Mon: [{ start: "07:00", end: "15:00" }] },
    },
  ]);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = [
    { id: "week", hours: 296, totalHours: 120, cost: 3145 },
    { id: "mon", hours: 52.5, totalHours: 24, cost: 530 },
    { id: "tue", hours: 52.5, totalHours: 24, cost: 530 },
    { id: "wed", hours: 52.5, totalHours: 24, cost: 530 },
    { id: "thu", hours: 52.5, totalHours: 24, cost: 530 },
    { id: "fri", hours: 52.5, totalHours: 24, cost: 530 },
    { id: "sat", hours: 52.5, totalHours: 24, cost: 530 },
    { id: "sun", hours: 52.5, totalHours: 24, cost: 530 },
  ];

  const moveShift = (
    employeeName: string,
    oldDay: string,
    newDay: string,
    shift: Shift
  ) => {
    setEmployees((prevEmployees) => {
      return prevEmployees.map((employee) => {
        if (employee.name === employeeName) {
          const updatedShifts = { ...employee.shifts };

          // Remove the shift from the old day
          updatedShifts[oldDay] = updatedShifts[oldDay].filter(
            (s) => s.start !== shift.start || s.end !== shift.end
          );

          // Prevent duplication by checking if the shift already exists in the new day
          if (!updatedShifts[newDay]) {
            updatedShifts[newDay] = [];
          }

          const alreadyExists = updatedShifts[newDay].some(
            (s) => s.start === shift.start && s.end === shift.end
          );

          if (!alreadyExists) {
            updatedShifts[newDay].push(shift);
          }

          return { ...employee, shifts: updatedShifts };
        }
        return employee;
      });
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto p-5">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              {data.map((day) => (
                <th key={day.id} className="">
                  <div className="flex justify-center gap-4">
                    <div className="bg-red-400 rounded p-1">
                      {day.hours} / {day.totalHours}
                    </div>

                    <div className="bg-blue-300 rounded p-1">{day.cost}</div>
                  </div>
                </th>
              ))}
            </tr>
            <tr>
              <th className="border border-white px-4 py-2">Employee</th>
              {daysOfWeek.map((day) => (
                <th key={day} className="border border-white px-4 py-2">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.name}>
                <td className="border border-white px-4 py-2">
                  {employee.name}
                </td>
                {daysOfWeek.map((day) => (
                  <ShiftDropZone
                    key={day}
                    employeeName={employee.name}
                    day={day}
                    shifts={employee.shifts[day] || []}
                    moveShift={moveShift}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DndProvider>
  );
};

interface ShiftDropZoneProps {
  employeeName: string;
  day: string;
  shifts: Shift[];
  moveShift: (
    employeeName: string,
    oldDay: string,
    newDay: string,
    shift: Shift
  ) => void;
}

const ShiftDropZone: React.FC<ShiftDropZoneProps> = ({
  employeeName,
  day,
  shifts,
  moveShift,
}) => {
  const [{ canDrop, isOver }, drop] = useDrop<
    DragItem,
    void,
    { canDrop: boolean; isOver: boolean }
  >(() => ({
    accept: "shift",
    drop: (item) => {
      moveShift(item.employeeName, item.day, day, item.shift);
    },
    canDrop: (item) => item.employeeName === employeeName,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <td
      // Applique directement le `ref` via `drop`
      ref={drop}
      className={`border border-white px-4 py-2 ${
        isOver ? (canDrop ? "bg-blue-100" : "bg-red-300") : ""
      }`}
    >
      {shifts.map((shift, index) => (
        <ShiftItem
          key={index}
          shift={shift}
          employeeName={employeeName}
          day={day}
        />
      ))}
    </td>
  );
};

interface ShiftItemProps {
  shift: Shift;
  employeeName: string;
  day: string;
}

const ShiftItem: React.FC<ShiftItemProps> = ({ shift, employeeName, day }) => {
  const [{ isDragging }, drag] = useDrag<
    DragItem,
    unknown,
    { isDragging: boolean }
  >(() => ({
    type: "shift",
    item: { shift, employeeName, day },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-green-300 text-white text-center p-1 my-1 rounded cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {shift.start} - {shift.end}
    </div>
  );
};

export default Calendar;
