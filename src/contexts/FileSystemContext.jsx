import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FileSystemContext = createContext(null);

const initialFileSystem = {
    "root": {
        id: "root",
        type: "folder",
        name: "Root",
        children: [],
    },
};

export const FileSystemProvider = ({ children }) => {
    const [fileSystem, setFileSystem] = useState(() => {
        const storedFileSystem = localStorage.getItem('fileSystem');
        return storedFileSystem ? JSON.parse(storedFileSystem) : initialFileSystem;
    });
    const [currentDirectory, setCurrentDirectory] = useState("root");

    useEffect(() => {
        localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
    }, [fileSystem]);

    const createFile = (name, content) => {
        const id = uuidv4();
        const newFile = { id, type: "file", name, content: content || "" };
        setFileSystem((prevFileSystem) => {
            return {
                ...prevFileSystem,
                [id]: newFile,
                [currentDirectory]: {
                    ...prevFileSystem[currentDirectory],
                    children: [...prevFileSystem[currentDirectory].children, id],
                },
            };
        });
    };

    const createFolder = (name) => {
        const id = uuidv4();
        const newFolder = { id, type: "folder", name, children: [] };

        setFileSystem((prevFileSystem) => {
            return {
                ...prevFileSystem,
                [id]: newFolder,
                [currentDirectory]: {
                    ...prevFileSystem[currentDirectory],
                    children: [...prevFileSystem[currentDirectory].children, id],
                },
            };
        });
    };

    const deleteItem = (id) => {
        setFileSystem((prevFileSystem) => {
            const newFileSystem = { ...prevFileSystem };
            delete newFileSystem[id];

            // Remove the item from its parent's children array
            for (const key in newFileSystem) {
                if (newFileSystem[key].type === "folder" && newFileSystem[key].children) {
                    newFileSystem[key].children = newFileSystem[key].children.filter(childId => childId !== id);
                }
            }
            return newFileSystem;
        });
    };

    const renameItem = (id, newName) => {
        setFileSystem((prevFileSystem) => ({
            ...prevFileSystem,
            [id]: { ...prevFileSystem[id], name: newName },
        }));
    };

    const updateFileContent = (id, content) => {
        setFileSystem((prevFileSystem) => ({
            ...prevFileSystem,
            [id]: { ...prevFileSystem[id], content: content },
        }));
    };
    const navigateToDirectory = (id) => {
        setCurrentDirectory(id);
    };

    const value = {
        fileSystem,
        createFile,
        createFolder,
        deleteItem,
        renameItem,
        updateFileContent,
        currentDirectory,
        navigateToDirectory,
    };

    return (
        <FileSystemContext.Provider value={value}>
            {children}
        </FileSystemContext.Provider>
    );
};

export const useFileSystem = () => {
    const context = useContext(FileSystemContext);
    if (!context) {
        throw new Error("useFileSystem must be used within a FileSystemProvider");
    }
    return context;
};