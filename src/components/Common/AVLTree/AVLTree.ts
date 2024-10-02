import { AVLTreeNode } from "./AVLTreeNode";

function Sign(ANumber:number)
{
    if (ANumber>0) return 1;
    if (ANumber<0) return -1;
    return 0;
}

function OppositeSign(ANumber:number)
{
    if (ANumber>0) return -1;
    if (ANumber<0) return 1;
    return 0;
}

export class AVLTree
{
    private mainNode:AVLTreeNode=null;
    private count:number=0;

    // Interaccion otros objetos.
    private onCreateKey=null;
    private onCompare=null;
    
    // Implementación.
    protected getMainNode()
    {
        return this.mainNode;
    }
    protected doSetMainNode(ANode:AVLTreeNode)
    {
        this.mainNode=ANode;
    }
    protected doGetNode(AKey)
    {
        return this.doGetNodeFrom(this.mainNode,AKey);
    }
    protected doGetNodeFrom(ANode:AVLTreeNode,AKey):AVLTreeNode|null
    {
        let found:boolean=false;
        let compare:number=0;
        let result:AVLTreeNode|null=null;
        let parent:AVLTreeNode|null=null;
        
        if (!this.onCompare)
            return null;

        result=ANode;
        while(!found && result)
        {
            parent=result.Parent;
            compare=this.compareKey(result,ANode);
            found=compare==0;
            if (!found)
            {
                if (compare<0)
                    result=result.Left;
                else result=result.Right;
            }
        }

        if (!result)
            return parent;
        return result;
    }
    protected ResetNodeHeight(ANode:AVLTreeNode)
    {
        let result:number=0;
        if (ANode.Left)
            result=ANode.Left.Height;

        if (ANode.Right)
            if (ANode.Right.Height>result)
            result=ANode.Right.Height;

        result++;
        ANode.Height=result;
        return result;
    }
    protected CheckNodeBalance(ANode:AVLTreeNode):number
    {
        let result:number=0;
        let balance:number=0;

        while(ANode)
        {
            this.ResetNodeHeight(ANode);
            balance=this.CheckNodeBalance(ANode);
            if (balance>1 || balance<-1)
                ANode=this.DoBalance(ANode,balance);
            ANode=ANode.Parent;
            result++;
        }
        return result;
    }

    protected rotate(ANode:AVLTreeNode,ADirection:number):AVLTreeNode
    {
        let result:AVLTreeNode|null=null;

        if (ADirection>0)
        {
            result=ANode.Right;
            ANode.Right=result.Left;
            result.Left=ANode;
        }
        else
        {{
            result=ANode.Left;
            ANode.Left=result.Right;
            result.Right=ANode;
        }}

        if (ANode.Parent)
        {
            if (ANode.Parent.Left==ANode)
                ANode.Parent.Left=result;

            else ANode.Parent.Right=result;
        }
        else this.doSetMainNode(result);

        result.Parent=ANode.Parent;
        result.Right.Parent=result;
        result.Left.Parent=result;

        if (ANode.Left)
            ANode.Left.Parent=ANode;
        if (ANode.Right)
            ANode.Right.Parent=ANode;

        this.ResetNodeHeight(ANode);
        this.ResetNodeHeight(result);
        return result;
    }
    protected rotateDouble(ANode:AVLTreeNode,ADirection:number)
    {   
        let result:AVLTreeNode|null=null;
        let alnode:AVLTreeNode|null=null;
        let arnode:AVLTreeNode|null=null;

        if (ADirection>0)
            result=ANode.Right.Left;
        else result=ANode.Left.Right;

        alnode=result.Left;
        arnode=result.Right;

        if (ANode.Parent)
        {
            if (ANode.Parent.Left==ANode)
                ANode.Parent.Left=result;
            else ANode.Parent.Right=result;
        }
        else this.doSetMainNode(result);
        result.Parent=ANode.Parent;

        if (ADirection>0)
        {
            result.Left=ANode;
            result.Right=ANode.Right;
        }
        else
        {
            result.Left=ANode.Left;
            result.Right=ANode;
        }

        result.Left.Parent=result;
        result.Right.Parent=result;

        result.Left.Right=alnode;
        if (alnode)
            alnode.Parent=result.Left;
        
        result.Right.Left=arnode;
        if (arnode)
            arnode.Parent=result.Right;

        this.ResetNodeHeight(result.Left);
        this.ResetNodeHeight(result.Right);
        this.ResetNodeHeight(result);
        return result;
    }

    protected DoBalance(ANode:AVLTreeNode,ADirection:number):AVLTreeNode
    {
        let double:boolean=false;
        let result:AVLTreeNode|null;

        if (ADirection>0)
            double=OppositeSign(this.CheckNodeBalance(ANode.Right))==Sign(ADirection);
        else double=OppositeSign(this.CheckNodeBalance(ANode.Left))==Sign(ADirection);

        if (double)
            result=this.rotateDouble(ANode,ADirection);
        else result=this.rotate(ANode,ADirection);
        return result;
    }
    protected compareKey(AKey1,AKey2)
    {
        if (this.onCompare)
            return this.onCompare(AKey1,AKey2);
        return 0;
    }
    protected doRemove(AKey):boolean
    {
        return false;
    }
    protected doAdd(AKey,AItem):boolean
    {
        let treeNode:AVLTreeNode=null;
        let node:AVLTreeNode|null=this.doGetNode(AKey);
        let result:boolean=false;

        if (!node)
        { 
            treeNode = new AVLTreeNode(this,AKey,AItem);

            if (!this.mainNode)
            {
                this.mainNode=treeNode;
                result=true;
            }
            else
            {
                node=this.doGetNode(AKey);
                if (this.compareKey(node.Key,AKey)<0)
                    node.Left=AItem;
                else node.Right=AItem;
                result=true;
            }
        }
        return result;
    }
    protected IsLeafNode(ANode:AVLTreeNode):boolean
    {
        if (ANode)
            if (ANode.Tree==this)
                return !ANode.Left && !ANode.Right;
        return false;
    }
    protected doSetParentNode(ANode:AVLTreeNode,AParent:ATreeNode)
    {
        let result:AVLTreeNode;
        if (!ANode) return null;
        if (ANode.Parent==AParent) return null;
        
        if (ANode.Parent)
        {
            if (ANode.Parent.Left==ANode)
                ANode.Parent.Left=null;
            else ANode.Parent.Right=null;
            this.ResetNodeHeight(ANode.Parent);
            ANode.Parent=null;
        }

        if (AParent)
        {
            if (this.compareKey())
            {}
        }
    }
    protected doDeleteNode(ANode:AVLTreeNode):boolean
    {
        let aparent:AVLTreeNode|null=null;
        let aremaining:AVLTreeNode|null=null;
        let asubstitute:AVLTreeNode|null=null;

        if (this.IsLeafNode(ANode))
        {
            aparent=ANode.Parent;
            asubstitute=aparent;

            if (ANode=this.getMainNode())
                this.doSetMainNode(null);
        }
        else
        {
            if (ANode.Left)
            {
                asubstitute=ANode.Left;
                aremaining=ANode.Right
            } 
            else
            { 
                asubstitute=ANode.Right;
                aremaining=ANode.Left;
            }

            if (aremaining)

            aparent=asubstitute.Parent;

        }
    }
    // Interaccion con objetos.
    keyChanged(ANode:AVLTreeNode)
    {

    }
    valueChanged(ANode:AVLTreeNode)
    {

    }
    // Interface de programación.
    constructor()
    {}

    getItem(AKey):any
    {
        return this.doGetNode(AKey)
    }
    add(AItem):boolean
    {
        if (this.onCreateKey(AItem))
        {
            let key=this.onCreateKey(AItem);
            if (key && !this.getItem(AItem))
                return this.doAdd(key,AItem);
        }
        return false;
    }
    remove(AItem):boolean
    {
        let key=this.onCreateKey(AItem);
        if (key)
            return this.doRemove(key);
        return false;
    }
    get MainNode()
    {
        return this.mainNode;
    }
    get Count()
    {
        return this.count;
    }

    get OnCreateKey()
    {
        return this.onCreateKey;
    }
    set OnCreateKey(AFunction:any)
    {
        this.OnCreateKey=AFunction;
    }
    get OnCompare()
    {
        return this.onCompare;
    }
    set OnCompare(AFunction:any)
    {
        this.onCompare=AFunction;
    }
}