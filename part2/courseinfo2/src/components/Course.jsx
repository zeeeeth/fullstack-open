const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => (
  <div>
    {props.parts.map((part, index) => (
      <Part key={index} part={part} />
    ))}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p><strong>total of {props.total} exercises</strong></p>

const Course =({course}) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total total={course.parts.reduce((sum, part) => sum + part.exercises, 0)} />
        </div>
    )
}

export default Course