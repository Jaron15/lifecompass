import { logDOM } from '@testing-library/react';
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,ReferenceLine, LabelList, Label  } from 'recharts';


function WeeklyChart({ data, goal }) {
    const getDayAbbreviation = (day) => {
        const abbreviations = {
            "Sunday": "Sun",
            "Monday": "Mon",
            "Tuesday": "Tue",
            "Wednesday": "Wed",
            "Thursday": "Thu",
            "Friday": "Fri",
            "Saturday": "Sat"
        };
        return abbreviations[day];
    }
    
    
    const getMaxValue = (data) => {
        const maxTimeSpent = Math.max(...data.map(item => item.timeSpent));
        return Math.ceil(maxTimeSpent / 10) * 10; 
    }
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip bg-white p-2 border rounded">
                    <p className="label">{`${label} : ${Math.round(payload[0].value)} mins (avg)`}</p>
                </div>
            );
        }
        return null;
    };
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data.map(item => ({ ...item, name: getDayAbbreviation(item.name) }))}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, getMaxValue(data)]} />
                 <YAxis dataKey="name" type="category" width={40} />
                 <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="timeSpent" fill="#4c9cc7" />
                <ReferenceLine x={goal} stroke="orange" strokeDasharray="5 5"  >
                    <Label value={"Goal"} position={"insideBottomLeft"} />
                </ReferenceLine>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default WeeklyChart;
