#include<bits/stdc++.h>
using namespace std;

int partition(int arr[],int left,int right,int &ans)
{
    int index = left;
    int pivot = right;
    for(int i=left;i<right;i++)
    {
        if(arr[i] < arr[pivot])
        {
            swap(arr[i],arr[index]);
            index++;
        }
    }
    swap(arr[right],arr[index]);
    return index;
}
void quickSort(int arr[],int left,int right,int k,int &ans)
{
    if(k>0 && k<=right-left+1)
    {
        int p = partition(arr,left,right,ans);
        if(p-left==k-1)
            ans = arr[p];
        else if(p-left>k-1)
            quickSort(arr,left,p-1,k,ans);
        else
            quickSort(arr,p+1,right,k-p+left-1,ans);
    }
}
int main()
 {
	// int t;
	// cin >> t;
	// while(t--)
	{
	    int n;
	    cin >> n;
	    int arr[n];
	    for(int i=0;i<n;i++)
	        cin >> arr[i];
	    int k,ans=-1;
	    cin >> k;
	    quickSort(arr,0,n-1,k,ans);
	    cout <<ans << "\n";
	}
	return 0;
}