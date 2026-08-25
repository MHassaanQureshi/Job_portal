interface Props {
    link: string,
    text: string
}

export default function CustomButton({ link, text }: Props) {
    return (
        <a href={link} className="bg-blue-500 p-2 rounded text-white  text-sm">
            {text}
        </a>
    )
}