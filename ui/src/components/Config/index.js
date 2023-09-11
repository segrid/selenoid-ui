import React, { useState } from "react";
import './config.css'; // Make sure to create the corresponding CSS file


const Config = ({ config = {}, query = "" }) => {
    const [formData, setFormData] = useState({ ...config });

    const [cloudConfig, setCloudConfig] = useState({ ...formData.cloudConfig });

    console.log(cloudConfig)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCloudConfigChange = (e) => {
        const { name, value } = e.target;
        setCloudConfig((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleTableUpdate = (index, field, value) => {
        setFormData((prevValues) => {
            const newTableData = [...prevValues.tableData];
            newTableData[index][field] = value;
            return {
                ...prevValues,
                tableData: newTableData,
            };
        });
    };

    const removeSecurityGroup = (index) => {
        const updatedSecurityGroups = [...cloudConfig.securityGroups];
        updatedSecurityGroups.splice(index, 1);
        console.log(updatedSecurityGroups)
        
        setCloudConfig((prevConfig) => ({
          ...prevConfig,
          securityGroups: updatedSecurityGroups
        }));
      };

      const removeSubnets = (index) => {
        const updatedSubnets = [...cloudConfig.subnetIds];
        updatedSubnets.splice(index, 1);
        console.log(updatedSubnets)
        
        setCloudConfig((prevConfig) => ({
          ...prevConfig,
          subnetIds: updatedSubnets
        }));
      };
    
      const removeTags = (index) => {
        const updatedSubnets = [...cloudConfig.subnetIds];
        updatedSubnets.splice(index, 1);
        console.log(updatedSubnets)
        
        setCloudConfig((prevConfig) => ({
          ...prevConfig,
          subnetIds: updatedSubnets
        }));
      };

    const handleSave = async () => {
        try {
            // Send the updated config to the server
            const response = await fetch("/config", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            // Handle successful response or errors from the server
        } catch (error) {
            // Handle fetch errors
        }
    };

    const handleCancel = () => {
        // Reset the form to the initial config values
        formData = config;
    };

    return (
        <div className="config-form">
            {/* Fields */}
            <div class="column">
                <label>Scaling Mode:</label>
                <input
                    type="text"
                    name="scalingMode"
                    value={cloudConfig.scalingMode}
                    onChange={handleCloudConfigChange}
                />
            </div>

            <div class="column">
                <label>Instance Type:</label>
                <input
                    type="text"
                    name="instanceType"
                    value={cloudConfig.instanceType}
                    onChange={handleCloudConfigChange}
                />
            </div>
            <div class="column">
                <label>Max Instances:</label>
                <input
                    type="number"
                    name="maxInstances"
                    value={cloudConfig.maxInstances}
                    onChange={handleCloudConfigChange}
                />
            </div>
            <div class="column">
                <label>Min Free Sessions:</label>
                <input
                    type="number"
                    name="minAvailableSessions"
                    value={cloudConfig.minAvailableSessions}
                    onChange={handleCloudConfigChange}
                />
            </div>
            <div class="column">
                <label>Max Sessions:</label>
                <input
                    type="number"
                    name="maxSessions"
                    value={cloudConfig.maxSessions}
                    onChange={handleCloudConfigChange}
                />
            </div>
            <div class="column">
                <label>Base Disk Size (GB):</label>
                <input
                    type="number"
                    name="imageDiskSize"
                    value={cloudConfig.imageDiskSize}
                    onChange={handleCloudConfigChange}
                />
            </div>
            <div class="column">
                <label>Instance Name Prefix:</label>
                <input
                    type="text"
                    name="namePrefix"
                    value={cloudConfig.namePrefix}
                    onChange={handleCloudConfigChange}
                />
            </div>
            <div class="column">

            </div>
            <div class="column">

            </div>
            <div class="column span-3">
                <label>Init Script:</label>
                <textarea
                    rows="4"
                    name="initScript"
                    value={cloudConfig.initScript}
                    onChange={handleCloudConfigChange}
                    placeholder = "#!/bin/bash"
                />
            </div>
            <div class="column">
                <label>Security Groups:</label>
                <ul>
                    {cloudConfig.securityGroups.map((value, index) => (
                        <li key={index}>
                            <a class="delete" title="Delete" onClick={() => removeSecurityGroup(index)}>(x) </a>
                            {value}
                            
                            {/* <button onClick={() => handleRemoveSecurityGroup(index)}>Remove</button> */}
                        </li>
                    ))}
                </ul>
                {/* Input field for adding new value */}
                {/* <input
                    type="text"
                    value={newSecurityGroup}
                    onChange={handleChange}
                    placeholder="Add a new security group"
                /> */}
                {/* <button onClick={handleAddSecurityGroup}>Add</button> */}
            </div>
            <div class="column">
                <label>Subnets:</label>
                <ul>
                    {cloudConfig.subnetIds.map((value, index) => (
                        <li key={index}>{value}
                            {/* <button onClick={() => handleRemoveSecurityGroup(index)}>Remove</button> */}
                        </li>
                    ))}
                </ul>
                {/* Input field for adding new value */}
                {/* <input
                    type="text"
                    value={newSecurityGroup}
                    onChange={handleChange}
                    placeholder="Add a new security group"
                /> */}
                {/* <button onClick={handleAddSecurityGroup}>Add</button> */}
            </div>
            <div class="column">
                <label>Instance Tags:</label>
                <ul>
                    {cloudConfig.tags.map((row, index) => (
                        <li key={row.name}>{row.name}: {row.value}
                            {/* <button onClick={() => handleRemoveSecurityGroup(index)}>Remove</button> */}
                        </li>
                    ))}
                </ul>
                {/* Input field for adding new value */}
                {/* <input
                    type="text"
                    value={newSecurityGroup}
                    onChange={handleChange}
                    placeholder="Add a new security group"
                /> */}
                {/* <button onClick={handleAddSecurityGroup}>Add</button> */}
            </div>
        </div>

    );
};

export default Config;