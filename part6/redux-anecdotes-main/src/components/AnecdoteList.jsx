import { useSelector, useDispatch } from 'react-redux';
import { incrementVotes } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';
import anecdoteService from '../services/anecdotes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnecdotes, updateAnecdote } from '../requests';
import { useContext } from 'react';
import NotificationContext, { showNotification } from '../NotificationContext';

const Anecdote = ({ anecdote, handleVote }) => {

    return (
        <li>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
        </li>
    )
}

const AnecdoteList = () => {
    
    const filter = useSelector(state => state.filter) ?? ''
    const { notificationDispatch } = useContext(NotificationContext)
    const queryClient = useQueryClient()
    
    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes
    })

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            const updatedAnecdotes = anecdotes.map(anecdote =>
                anecdote.id === newAnecdote.id ? newAnecdote : anecdote
            )
            queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
            showNotification(notificationDispatch, `You voted '${newAnecdote.content}'`, 5000)
        },
        onError: (error) => {
            showNotification(notificationDispatch, error.message ?? 'Failed to update anecdote', 5000)
        }
    })

    if (result.isLoading) {
        return <div>Loading...</div>
    }

    if (result.isError) {
        return <div>Error: {result.error.message}</div>
    }

    const anecdotes = result.data

    const filteredAnecdotes = anecdotes
        .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
        .slice()
        .sort((a, b) => b.votes - a.votes)

    return (
    <ul>
        {filteredAnecdotes.map(anecdote => (
            <Anecdote 
                key={anecdote.id}
                anecdote={anecdote}
                handleVote={(anecdote) => {
                    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
                }}
            />
      ))}
    </ul>
    )
}

export default AnecdoteList;