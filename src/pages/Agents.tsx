import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Terminal, Plus } from "lucide-react";
import MainNav from "../components/MainNav";
import { DeployAgentDialog } from "../components/DeployAgentDialog";
import { useToast } from "@/components/ui/use-toast";

export default function Agents() {
  const { toast } = useToast();

  const handleDeploy = () => {
    toast({
      title: "Coming Soon",
      description: "Agent deployment will be available soon"
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav title="Agent Builder" />
      
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Agent
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No agents deployed</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by deploying your first agent
            </p>
            <DeployAgentDialog 
              onDeploy={handleDeploy}
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Deploy Agent
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
