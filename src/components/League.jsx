import { FaGolfBall } from 'react-icons/fa';

function League() {
  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="card text-center">
        <h1 className="text-4xl font-bold text-emerald-green flex items-center justify-center mb-4">
          <FaGolfBall className="mr-2 text-golden-yellow" /> Thursday Night Men's League
        </h1>
        <p className="text-dark-slate text-lg">
          Lake of the Sandhills Golf Course
        </p>
      </div>
    </div>
  );
}

export default League;