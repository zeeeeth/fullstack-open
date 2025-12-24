import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { incrementVotes } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    const vote = (id) => {
        dispatch(incrementVotes(id))
    }

    return (
    <div>
        {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
    )
}

export default AnecdoteList;