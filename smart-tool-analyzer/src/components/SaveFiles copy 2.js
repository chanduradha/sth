import React, { useEffect } from 'react';

const SaveFiles = ({ selectedFiles }) => {

    useEffect(() => {
        // console.log("Selected Files in SaveFiles Component:");
        // console.log(selectedFiles); // Log the selected files array received as props
    
        // Loop through the selected files array and read the content of each file
        selectedFiles.forEach((file, index) => {
          const reader = new FileReader();
    
          reader.onload = (e) => {
            const content = e.target.result;
            console.log(`Content of File ${index + 1}:`);
            console.log(content); // Log the content of each file
          };
    
          reader.readAsText(file); // Read file content as text
        });
      }, [selectedFiles]);


  return (
    <div className="mt-4" style={{position:'relative', left:'60%',bottom:'1100px', width:'600px'}}>
      <h2 className="text-lg font-bold mb-2" >Saved Files</h2>
      <div className="overflow-x-auto">
      <table className=" sm:w-2/3 md:w-1/2 lg:w-1/3 divide-y divide-gray-200 dark:bg-gray-700" >

          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedFiles.map((file, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{file.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaveFiles;
