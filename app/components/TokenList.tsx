'use client'
import { useEffect, useState } from "react";
import { Send, UserData } from "../lib/model";
import Link from "next/link";
import { getCookie } from "cookies-next";


const TokenList: React.FC<{ lineLink: string }> = ({ lineLink }) => {
    const [data, setData] = useState<UserData[]>([]);
    const [user, setUser] = useState("");
    useEffect(() => {
        GetUser();
        reset();
    }, []);
    const reset = async () => {
        try {
            const res = await fetch(`/api/findall`, {
                headers: { "Authorization": "Bearer " + getCookie("token") }
            });
            const data: UserData[] = await res.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const GetUser = async () => {
        try {
            const res = await fetch(`/api/auth/user`, {
                headers: { "Authorization": "Bearer " + getCookie("token") }
            });
            const data: string = await res.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const api = async (href: string, message: Send) => {
        try {
            const response = await fetch(href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('post successfully:', data);
                reset();
            } else {
                console.error('Failed to create user:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };
    const Token: React.FC<{ user: UserData }> = ({ user }) => {
        const [text, setText] = useState("test");
        const [edit, setEdit] = useState(false);
        const [name, setName] = useState(user.name);
        const [isCopied, setIsCopied] = useState(false);

        const handleCopyClick = async () => {
            try {
                await navigator.clipboard.writeText(user._id);
                setIsCopied(true);
            } catch (error) {
                console.error('Error copying to clipboard:', error);
            }
        };
        return <div className="bg-slate-300 flex items-center justify-between rounded-xl p-4 shadow-md shadow-red-700">
            <div className="flex items-center space-x-2">
                <button className="btn btn-sm btn-outline bg-slate-200 transform transition-transform duration-300 hover:scale-110" onClick={async () => {
                    if (edit) {
                        await api('/api/rename', { token: user._id, message: name });
                    } setEdit(!edit);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                    </svg>
                </button>
                {edit ?
                    <input type="text" placeholder="Type here" className="input input-bordered input-primary lg:w-full w-20 bg-slate-200 text-black placeholder:text-black"
                        value={name} // 設置 input 的值
                        onChange={(e) => setName(e.target.value)} // 監聽輸入變化
                    />
                    : <div className="text-lg font-semibold">{name}</div>
                }
            </div>
            <div className=" space-x-4 flex flex-row items-center p-2">
                <button
                    onClick={handleCopyClick}
                    className={`btn ${isCopied ? 'btn-success' : 'btn-primary'}`}
                >
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
                <input type="text" placeholder="Type here" className="input input-bordered input-primary lg:w-full w-20 bg-slate-200 text-black placeholder:text-black"
                    value={text} // 設置 input 的值
                    onChange={(e) => setText(e.target.value)} // 監聽輸入變化
                />
                <button className="btn btn-info btn-circle transform transition-transform duration-300 hover:scale-110" onClick={() => api('/api/send', { token: user._id, message: text })}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" >
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                    </svg>
                </button>
                <button className="btn btn-circle btn-error transform transition-transform duration-300 hover:scale-110" onClick={() => api('/api/delete', { token: user._id, message: "" })}>X</button>
            </div>
        </div >
    }
    return <div className="flex border-white">
        <div className="p-20 mx-auto lg:w-4/5 space-y-10">
            <div className="space-y-4 bg-orange-500 p-8 shadow-md rounded-md text-black">
                <div className=" font-bold">User : {user}</div>
                <Link className="btn btn-success" onClick={async () => {
                    api('/api/data', { token: "未命名", message: user });
                }} href={lineLink}> line link</Link>
                {data.map((user, index) => (<Token key={index} user={user} />))}
            </div >
        </div>
    </div >
}
export default TokenList;