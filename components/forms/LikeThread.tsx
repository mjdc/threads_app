import Image from 'next/image';
import { likeThread } from '@/lib/actions/thread.actions';

interface Props {
  threadId: string;
  userId: string;
  liked: boolean;
  setLiked :(liked: boolean) => void;
}

function LikeThread({ threadId, userId, liked, setLiked }: Props) {
  // const [liked, setLiked] = useState(userLiked); // State to track whether thread is liked or not

  const handleLikeClick = async () => {
    await likeThread(threadId, JSON.parse(userId), !liked);
    setLiked(!liked); // Update liked state
  };

  return (
    <Image
      src={liked? '/assets/heart-filled.svg': '/assets/heart-gray.svg'}
      alt="heart"
      width={24}
      height={24}
      className="cursor-pointer object-contain"
      onClick={handleLikeClick}
    />
  );
}

export default LikeThread;
