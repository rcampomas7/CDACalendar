import { AVLTree } from "./AVLTree";
export class AVLTreeNode
{
    private tree:AVLTree|null=null;
    private key:any=null;
    private value:any=null;
    private parent:AVLTreeNode|null=null;
    private left:AVLTreeNode|null=null;
    private right:AVLTreeNode|null=null;
    private height:number=0;

    // Implementación.
    protected keyChanged()
    {
        if (this.tree)
            this.tree.keyChanged(this);
    }
    protected valueChanged()
    {
        if (this.tree)
            this.tree.valueChanged(this);
    }
    // Interface
    constructor (ATree:AVLTree,AKey,AValue)
    {
        this.tree=ATree;
        this.key=AKey;
        this.value=AValue;
    }

    get Tree()
    {
        return this.tree;
    }
    get Key()
    {
        return this.key;
    }
    set Key(AKey)
    {
        this.key=AKey;
        this.keyChanged();
    }
    get Value()
    {
        return this.value;
    }
    set Value(AValue)
    {
        this.value=AValue;
        this.valueChanged();
    }

    get Parent():AVLTreeNode
    {
        return this.parent;
    }
    set Parent(ANode:AVLTreeNode)
    {
        this.parent=ANode;
    }
    get Left():AVLTreeNode
    {
        return this.left;
    }
    set Left(ANode:AVLTreeNode)
    {
        if (this.left!=ANode)
            this.left=ANode;
    }

    get Right():AVLTreeNode
    {
        return this.right;
    }
    set Right(ANode:AVLTreeNode)
    {
        if (this.right!=ANode)
            this.right=ANode;
    }
    get Height():number
    {
        return this.height;
    }
    set Height(AValue:number)
    {
        this.height=AValue;
    }
}