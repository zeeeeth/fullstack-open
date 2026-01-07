import axios from 'axios';
import type { NonSensitiveDiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

const getAllDiaries = async () => {
    try { 
        const res = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl)
        return res.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                typeof error.response?.data === 'string'
                    ? error.response.data
                    : error.message
            );
        }
        throw new Error('Unknown error');
    }
}

const createDiary = async (object: NewDiaryEntry) => {
    try {
        const addedDiary = await axios.post<NewDiaryEntry>(baseUrl, object)
        return addedDiary.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                typeof error.response?.data === 'string'
                    ? error.response.data
                    : error.message
            )
        }
        throw new Error('Unknown error');
    }
}

export { getAllDiaries, createDiary };