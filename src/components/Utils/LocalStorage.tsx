import {useState} from "react";


export function useLocalStorage(key: string, initValue: string){
    const [value, setValue] = useState(()=>{
        try{
            const item = window.localStorage.getItem(key as string);
            return item? item: initValue;
        }
        catch(error){
            return initValue;
        }
    });

    const setStoredValue = (newValue:String) =>{
        try{
            setValue(newValue);
            window.localStorage.setItem(key as string, newValue as string);
        }
        catch(error){
            console.error("Error setting localStorage item:", error);
        }
    };

    return { value, setStoredValue };
}