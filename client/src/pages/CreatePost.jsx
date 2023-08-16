import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import { preview } from '../assets'
import {getRandomPrompt} from '../utils'
import {FormField, Loader} from '../components'


const CreatePost = () => {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:'',
    prompt:'',
    photo:''
  })

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading,setLoading] = useState(false);

  const generateImage = async () => {
    if(form.prompt){
      try {
        setGeneratingImg(true);
        const authorize = `Bearer ${import.meta.env.VITE_EDEN_AI_API_KEY}`;
        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: authorize
          },
          body: JSON.stringify({
            response_as_dict: true,
            attributes_as_list: false,
            show_original_response: false,
            providers:"openai",
            text: form.prompt,
            resolution: '256x256',
            num_images: 1
          })
        };
        
        let img;
        const data = await fetch('https://api.edenai.run/v2/image/generation', options)
          .then(response => response.json())
          .then(response => img = response.openai.items[0].image)
          .catch(err => console.error(err));
        img = "data:image/jpeg;base64,"+img
        setForm({...form, photo:img})
      }
      finally{
        setGeneratingImg(false);
      }
    }
    else {
      alert('Please Enter a Prompt')
    }
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(form.prompt && form.photo){
      setLoading(true);

      try{
        const response = await fetch("https://openai-clone-s8wb.onrender.com/api/v1/post",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({...form})
        })

        await response.json();
        alert("Success")
        navigate('/');

      }catch(e){
        alert(e.message);
      }finally {
        setLoading(false);
      }
    }else {
      alert('please enter a prompt and generate an image')
    }
  }

  const handleChange = (e) =>{
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSurpriseMe = () =>{
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({...form, prompt: randomPrompt})
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
        <p className='mt-2 text-[#666e75] text-[14px] max-w[500px]'> Create imaginative and visually stunning images generated through DALL-E AI and share them with the community.</p>
      </div>

      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField 
            labelName= "Your Name"
            type="text"
            name="name"
            placeholder="John"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField 
            labelName= "Prompt"
            type="text"
            name="prompt"
            placeholder="a cat sitting on a duck"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className='relative bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ? (
              <img src= {form.photo} alt= {form.prompt} className='w-full h-full object-contain'/>
            ) : (
              <img src={preview} alt="preview" className='w-9/12 h-9/12 object-contain opacity-40'/>
            )}

            {generatingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}

          </div>
        </div>
        
        <div className='mt-5 flex gap-5'>
          <button type="button" onClick= {generateImage} className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
            {generatingImg ? "Generating" : "Generate Image"}
          </button>
        </div>
        
        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image you want, you can share it with others in the community.</p>
          <button
            // type='submit'
            onClick={handleSubmit}
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
          {loading ? "Sharing..." : "Share with the community"}
          </button>
        </div>

      </form>
    </section>
  )
}

export default CreatePost