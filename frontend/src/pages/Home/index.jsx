import backend from '../../axios/backend'
import { useEffect } from 'react'
 
const Home = () => {

    useEffect(() => {
        backend.get('/users/me').then((response) => {
            console.log("Je fonctionne users/me ?")
            console.log(response);
        }, (error) => {
            if (401 === error.response.status)
               { console.log("ERROR: PERMISSION DENIED -> AUTHORIZATION NOT COMPLETED") }
            else
                { console.log("ERROR: unknown error in index home") }
        })
    })
    return (
        <div>
            <h1>HOME BITCHZ</h1>
        </div>
    )
}

export default Home