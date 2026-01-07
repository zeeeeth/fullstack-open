import axios from 'axios';
import type { NonSensitiveDiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

const getAllDiaries = () => {
    return axios.get<NonSensitiveDiaryEntry[]>(baseUrl)
        .then(response => response.data);
}

const createDiary = (object: NewDiaryEntry) => {
    return axios
        .post<NewDiaryEntry>(baseUrl, object)
        .then(response => response.data);
}

export { getAllDiaries, createDiary };