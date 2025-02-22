// src/contexts/FileSystemContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext'; // Import useAuth

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
  const { user } = useAuth(); // Get the current user
    const [fileSystem, setFileSystem] = useState(() => {
      if(user){
        const storedFileSystem = localStorage.getItem(`fileSystem_${user.username}`);
        return storedFileSystem ? JSON.parse(storedFileSystem) : initialFileSystem;
      }
        return initialFileSystem;
    });

  const [currentDirectory, setCurrentDirectory] = useState("root");

  useEffect(() => {
    if (user) {
      localStorage.setItem(`fileSystem_${user.username}`, JSON.stringify(fileSystem));
    }
  }, [fileSystem, user]); // Depend on user as well

  // Check if a user is logged in before accessing the filesystem
  const checkUser = () => {
    if (!user) {
        console.warn("No user logged in. File system operations cannot be performed.");
        return false;
    }
    return true;
    }

    const createFile = (name, content) => {
      if (!checkUser()) return; // Prevent operations if no user

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
        if (!checkUser()) return; // Prevent operations if no user

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
      if (!checkUser()) return; // Prevent operations if no user

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
      if (!checkUser()) return; // Prevent operations if no user

        setFileSystem((prevFileSystem) => ({
            ...prevFileSystem,
            [id]: { ...prevFileSystem[id], name: newName },
        }));
    };

    const updateFileContent = (id, content) => {
      if (!checkUser()) return; // Prevent operations if no user
      setFileSystem((prevFileSystem) => ({
        ...prevFileSystem,
        [id]: { ...prevFileSystem[id], content },
      }));
    };
    const navigateToDirectory = (id) => {
        if (!checkUser()) return; // Prevent operations if no user
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