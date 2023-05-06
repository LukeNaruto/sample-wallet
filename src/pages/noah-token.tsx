import dynamic from 'next/dynamic';
import { useState } from 'react';
import { 
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useContractRead,
    useContractReads,
    useContractEvent,
} from 'wagmi';

import { abi } from '@/abi/NoahToken.json';

import {
    Heading,
    Spinner,
    Alert,
    Input,
    useToast,
    Button
} from '@chakra-ui/react';

const contract = {
    address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
    abi,
}

function NoahToken() {
    
    return ( 
        <div className="flex flex-col gap-8 p-8">
            <Heading as='h1' size='4xl' noOfLines={1}></Heading>
            <Detail />
            <BalanceOf />
            <Transfer />
            <Allowance />
            <Approve />
            <TransferFrom />
        </div>
     );
}
function BalanceOf(){
    const [address, setAddress] = useState('');
    const {
        data: balance,
        error,
        isError,
        isLoading,
        refetch
    } = useContractRead({
        ...contract,
        functionName: 'balanceOf',
        args: [address],
        enabled: address !== ''
    });

    useContractEvent({
        ...contract,
        eventName: 'Transfer',
        listener(from, to, value) {
            if( from === address || to === address){
                console.log(666, from, to);
                
                refetch();
            }
        }
    })

    return(<div className="flex flex-col gap-2">
            <Heading>查询代币余额- BalanceOf</Heading>

            <Input value={address} onInput={(e) => setAddress((e.target as any).value)} placeholder="输入钱包地址自动出查询代币余额"/>
            
            {isLoading ? <Spinner /> : <div>{balance as any && balance?.toString()}</div>}
            <div>
                {address !== '' && isError && (
                    <Alert status="error">{`查询失败，失败原因：${error}`}</Alert>
                )}
            </div>
        </div>)
}
function Transfer() {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState(0);

    const { config } = usePrepareContractWrite({
        ...contract,
        functionName: 'transfer',
        args: [address, amount],
        enabled: address !== '' && amount > 0
    });

    const {
        data,
        isLoading: isWriteLoading,
        error: writeError,
        write,
        isError: isWriteError
    } = useContractWrite(config);

    const {
        error: transactionError,
        isLoading: isTransactionLoading,
        isError: isTransactionError
    } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess() {
            toast({
                title: '转账成功',
                description: `转账成功，交易哈西：${data?.hash}`,
                status: 'success'
            })
        }
    });
    
    const toast = useToast();
    return (
        <div className="flex flex-col gap-2">
            <Heading>转noah代币 -- Transfer</Heading>
            <Input 
                value={address}
                onInput={(e) => setAddress((e.target as any).value)}
                placeholder='输入要转账的钱包地址'
            />
            <Input 
                value={amount}
                onInput={(e) => setAmount((e.target as any).value)}
                placeholder='输入要转账的代币数量'
            />
            <Button
                disabled={!write || isWriteLoading || isTransactionLoading}
                onClick={() => write?.()}
            >转账</Button>

            {(isWriteError || isTransactionError) && (
                <Alert status="error">
                    {`转账失败，原因:${isWriteError ? 'write': 'transaction'}${writeError || transactionError}`}
                </Alert>
            )}
        </div>
    )
}

function TransferFrom() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState(0);
    
    const {config} = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: 'approveFrom',
        args: [from, to, amount],
        enabled: from !== '' && to !== '' && amount !== 0
    });
    const {
        data,
        write,
        error: writeError,
        isError: isWriteError
    } = useContractWrite(config);
    const {
        error: transactionError,
        isError: isTransactionError,
        isLoading,
        isSuccess,
    } = useWaitForTransaction({
        hash: data?.hash
    });
    const toast = useToast();

    if (isSuccess) {
        toast({
            title: '转账成功-from',
            description: `转账成功，交易哈西： ${data?.hash}`,
            status: 'success'
        });
    }
    console.log(1, from, to , amount, isSuccess, isWriteError,isTransactionError, isLoading, !write );

    return (
        <div className="flex flex-col gap-2">
            <Heading>通过授权账户进行转账 -- TransferFrom</Heading>
            <Input 
                value={from}
                onInput={(e) => setFrom((e.target as any).value)}
                placeholder='输入已被授权的地址'
            />
            <Input 
                value={to}
                onInput={(e) => setTo((e.target as any).value)}
                placeholder='输入要转账的地址'
            />
            <Input 
                value={amount}
                onInput={(e) => setAmount((e.target as any).value)}
                placeholder='输入输入要授权的代币数量'
            />
            
      <Button
        disabled={!write || isLoading}
        onClick={() => {
            console.log(1.5, !write || isLoading);
            
          console.log(2, from, to , amount, isSuccess, isWriteError,isTransactionError, isLoading, !write );
          write?.();
        }}
      >
        转账222
      </Button>

            {
                isWriteError || isTransactionError ? (
                    <Alert>{`授权失败，原因${isWriteError ? 'write' : 'transaction'} - ${writeError || transactionError}`}</Alert>
                ) : null
            }
        </div>
    )
}
function Approve() {
    const [address, setAddress] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
  
    const { config } = usePrepareContractWrite({
      ...contract,
      functionName: "approve",
      args: [address, amount],
      enabled: address !== "" && amount !== 0,
    });
  
    const {
      data,
      write,
      error: writeError,
      isError: isWriteError,
    } = useContractWrite(config);
  
    const {
      error: transactionError,
      isError: isTransactionError,
      isLoading: isTransactionLoading,
      isSuccess,
    } = useWaitForTransaction({
      hash: data?.hash,
    });
  
    const toast = useToast();
  
    if (isSuccess) {
      toast({
        title: "授权成功",
        description: `授权成功，交易哈希：${data?.hash}`,
        status: "success",
      });
    }
    
    return (
      <div className="flex flex-col gap-2">
        <Heading>授权 -- Approve</Heading>
        <Input
          value={address}
          onInput={(e) => setAddress((e.target as any).value)}
          placeholder="输入要授权的钱包地址"
        />
        <Input
          value={amount}
          type="number"
          onInput={(e) => setAmount(Number((e.target as any).value))}
          placeholder="输入要授权的代币数量"
        />
        <Button
          disabled={!write || isTransactionLoading}
          onClick={() => {
            write?.();
          }}
        >
          授权
        </Button>
  
        {isWriteError || isTransactionError ? (
          <Alert status="error">{`授权失败，失败原因：${
            writeError || transactionError
          }`}</Alert>
        ) : null}
      </div>
    );
  }
function Allowance(){
    const [owner, setOwner] = useState('');
    const [spender, setSpender] = useState('');

    const { 
        data, 
        error, 
        refetch, 
        isError 
    } = useContractRead({
        ...contract,
        functionName: 'allowance',
        args: [owner, spender],
        enabled: owner !== '' && spender !== ''
    });

    useContractEvent({
        ...contract,
        eventName: 'Approval',
        listener(from, to, value) {
            if (from === owner || to === owner) {
                refetch();
            }
        }
    });
    return (
        <div className="flex flex-col gap-2">
            <Heading>查询代币授权余额 -- Allowance</Heading>
            <Input 
                placeholder='输入授权人地址'
                value={owner}
                onInput={(e) => setOwner((e.target as any).value)}
            />
            <Input 
                placeholder='输入被授权人地址'
                value={spender}
                onInput={(e) => setSpender((e.target as any).value)}
            />
            <div>{data ? data.toString() : '输入地址会自动显示授权余额'}</div>

            {
                owner !== '' && spender !== '' && isError ? (
                    <Alert status='error'>{`查询失败，失败原因：${error}`}</Alert>
                ) : null
            }
        </div>
    );
}

function Detail () {
    const { data, error, isError, isLoading } = useContractReads({
        contracts: [
            {
                ...contract,
                functionName: 'name'
            },
            {
                ...contract,
                functionName: 'symbol'
            },
            {
                ...contract,
                functionName: 'decimals'
            },
            {
                ...contract,
                functionName: 'totalSupply'
            }
        ],
    }) as any;
    const [name, symbol, decimals, totalSupply] = data || [];

    return (
        <div>
            <Heading>代币信息</Heading>
            {isLoading ? (<Spinner />) : (<>
                <div>代币名称： {name && name.toString()}</div>
                <div>代币代号： {symbol && symbol.toString()}</div>
                <div>代币精度： {decimals && decimals.toString()}</div>
                <div>代币总量： {totalSupply && totalSupply.toString()}</div>
            </>)}
            {
                isError && <Alert status="error">{ `查询失败，失败原因： ${error}` }</Alert>
            }
        </div>
    )
}

const _NoahToken = dynamic(() => Promise.resolve(NoahToken), { ssr: false });
// @ts-ignore
_NoahToken.useWallet = true;
export default _NoahToken;

// export default NoahToken;