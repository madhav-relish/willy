import React from "react"

export const IntegrationCard = ({ name, logo, description }: { name: string, logo: string, description: string }) => {
    const [connected, setConnected] = React.useState(false)
  
    return (
      <div className="border rounded-lg p-4 flex flex-col items-center">
        <img src={logo} alt={`${name} logo`} className="w-16 h-16 mb-4" />
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm text-center mb-4">{description}</p>
        <button
          onClick={() => setConnected(!connected)}
          className={`px-4 py-2 rounded ${connected ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
        >
          {connected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    )
  }