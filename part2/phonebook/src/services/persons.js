import axios from 'axios'
const baseURL = 'http://localhost:3001/api/persons'

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const create = newPerson => {
    const request = axios.post(baseURL, newPerson)
    return request.then(response => response.data)
}

// Do not use update function in 3.9
// const update = (id, newPerson) => {
//     const request = axios.put(`${baseURL}/${id}`, newPerson)
//     return request.then(response => response.data)
// }

const deletePerson = (id) => {
    const request = axios.delete(`${baseURL}/${id}`)
    return request.then(response => response.data)
}

export default {
    getAll: getAll,
    create: create,
    // update: update,
    deletePerson: deletePerson
}