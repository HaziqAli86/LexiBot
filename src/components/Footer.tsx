import { Bot, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="text-blue-500" />
            <span className="text-lg font-bold text-white">LexiBot</span>
          </div>
          <p className="text-sm max-w-xs">
            The next generation of AI legal assistance and general knowledge. 
            Powered by Llama 3.1 and AWS Cloud.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">Features</li>
            <li className="hover:text-blue-400 cursor-pointer">Pricing</li>
            <li className="hover:text-blue-400 cursor-pointer">API</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-400 cursor-pointer">Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
        <div className="text-xs">© 2025 LexiBot AI. All rights reserved.</div>
        <div className="flex gap-4">
            <Github className="h-4 w-4 hover:text-white cursor-pointer" />
            <Twitter className="h-4 w-4 hover:text-white cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}