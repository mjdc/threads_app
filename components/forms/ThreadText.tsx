import { fetchUserbyUserName } from "@/lib/actions/user.actions";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

interface Props {
  text: string;
}

function ThreadText({ text }: Props) {
  const renderMarkdownLink = ({ children, href }) => {
    return <Link className="text-primary-500" href={href}>{children}</Link>;
  };

  return (<ReactMarkdown components={{ a: renderMarkdownLink }}>{text}</ReactMarkdown>)
}

export default ThreadText;
