export default function TaskCard() {    
    return (
        <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer" onClick={() => viewTaskDetail(1)}>
            <h3 className="text-lg font-bold mb-2">Task Title</h3>
            <p className="text-gray-600">Task description goes here. This is a brief overview of the task.</p>
        </div>
    );

}