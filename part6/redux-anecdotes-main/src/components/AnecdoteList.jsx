import { useSelector, useDispatch } from 'react-redux';
import { incrementVotes } from '../reducers/anecdoteReducer';

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
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    return (
    <ul>
        {anecdotes.sort((a,b) => b.votes - a.votes).map(anecdote => (
            <Anecdote 
                key={anecdote.id}
                anecdote={anecdote}
                handleVote={() => dispatch(incrementVotes(anecdote.id))}
            />
      ))}
    </ul>
    )
}

export default AnecdoteList;