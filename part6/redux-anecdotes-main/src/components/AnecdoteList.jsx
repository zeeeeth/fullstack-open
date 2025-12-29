import { useSelector, useDispatch } from 'react-redux';
import { incrementVotes } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';
import anecdoteService from '../services/anecdotes';

const Anecdote = ({ anecdote, handleVote }) => {

    return (
        <li>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={handleVote}>vote</button>
            </div>
        </li>
    )
}

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes) ?? []
    const filter = useSelector(state => state.filter) ?? ''
    const dispatch = useDispatch()

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
                handleVote={async () => {
                    const updatedAnecdote = await anecdoteService.voteAnecdote(anecdote)
                    dispatch(incrementVotes(updatedAnecdote.id))
                    dispatch(setNotification(`Voted for '${anecdote.content}'`, 5000))
                }}
            />
      ))}
    </ul>
    )
}

export default AnecdoteList;