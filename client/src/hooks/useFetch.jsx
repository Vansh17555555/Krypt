import { useEffect,useState } from "react";

const apikey=import.meta.env.VITE_GIPHY_API
const useFetch=({keyword})=>{
    const [gifUrl,setGifUrl]=useState("");

    const fetchGifs=async()=>{
        try {
            const response =await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${keyword.split(" ").join("")}&limit=1`)
            const {data}=await response.json()
            setGifUrl(data[0]?.images?.downsized_medium?.url)
        }
        catch(error){
            console.error(error)
        }
    }
    useEffect(()=>{
        if(keyword) fetchGifs()
    },[keyword]);
return gifUrl;
}
export default useFetch