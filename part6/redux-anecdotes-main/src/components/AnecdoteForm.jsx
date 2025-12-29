import { useDispatch } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../requests';
import { useContext } from 'react';
import NotificationContext, { showNotification } from '../NotificationContext';

const AnecdoteForm = () => {
    const { notificationDispatch } = useContext(NotificationContext)
    const queryClient = useQueryClient()

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (newAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            showNotification(notificationDispatch, `Anecdote '${newAnecdote.content}' created`, 5000)
        },
        onError: (error) => {
            showNotification(notificationDispatch, error.message ?? 'Failed to create anecdote', 5000)
        }
    })

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        newAnecdoteMutation.mutate({ content, votes: 0 })
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                <input name="anecdote"/>
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm;