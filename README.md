**ImageStitcher** is a very simple HTML & Javascript you can run from your browser. It lets you combine images together vertically for manhwa/comic scanlation usage.

For example, if you have a bunch of images of a manhwa chapter ripped from a site that are too short, simply upload the images you want to combine together at the same time. The script will automatically combine them vertically into a longer panel. You can then download that produced image.

FYI: Look near the bottom of this document for the **Installation Guide** if you need help. I also have a YouTube video tutorial for using Image Stitcher (both versions): https://www.youtube.com/watch?v=cCSRCmCfyhs

**Got Input? Contact me. :D**
*Hi! My name is Lia. I enjoy helping with Manhwa/Manhua scanlation projects. I’m not a coder. Most of my script was heavily reliant on ChatGPT’s input (I maxed out on conversations so many times because I was asking so many questions lmao), and I’ve just stumbled my way through to something that actually works. I’ve learned more about coding in html and Javascript in the past three days I’ve been working on this non-stop than I have ever before in my life lol… and I still know basically nothing.*

*My Discord: @LiaLikeLaLa*.
*Feel free to message me with any questions, any improvements or suggestions, or if you just want another friend who has similar interests <3. 
Especially reach out if you’re willing to help me learn some code and make this script better! ;)*

The **ImageStitcher v1.2.html** file is the simplest and most stable version. 

The **ImageStitcher BATCH.html** files implements an “enable Batch mode” and “autoDownload” feature for batch handling of images. 

But the regular ImageStitcher v1.2 serves its purpose well if you don’t mind having to drag and drop (or select) each batch of images manually rather than all at once.

**Use case for regular ImageStitcher (non-Batch):**

Let’s say I downloaded a manhwa chapter and I now have 50 .jpg images. It’d be a lot easier if I could combine say, 3 or 4 or however many images together so I’m not having to deal with as many files. So I upload (drag and drop or click to select) the first 5 images into ImageStitcher (any version) and the script automatically combines and displays the finished result. 

A download link then appears that you can click to download the combined image. 

Btw, the BATCH version file also includes this functionality… just with even more features because of the option to enable Batch mode or not.

Also, I’m well aware the UI isn’t exactly a looker XD. At least it’s straightforward and it shouldn’t make anyone confused. I’m willing to take suggestions though lol.

**Use case for the ImageStitcher BATCH version:**

	I have 50 .jpg images taken from a manhwa chapter. I want to consolidate that into
something more reasonable, let’s say to around 16 or so images. 

With Batch Mode Enabled, I set Batch Size = 3 (which is the default value). This means every three images will be grouped in a batch and then combined.  
(FYI: Adjusting BatchSize lets you increase or decrease the number of images included in a single “batch” (or combined image). This is called batch size)). 

So I drag and drop all of my 50 .jpg images in at once.

The first batch is loaded (the first three images). I think the resulting combined image looks good and so I click the Download button. I then click the “Next Batch” button to proceed to the next combined image. I can rinse and repeat this step (looking through each batch’s combined image and downloading them). 

But wait—oh no; on the second batch (or any batch) I realize that the speech bubble/SFX is cut off at the end of the produced image… and I don’t want that. That will make TLing and TSing even harder. 

So to solve this, I can click the “Remove Image From Batch” button (moves the last image of the current batch to the beginning of the next batch) so that I can download the produced ‘combinedImage.png’  that only contains the first two images of that batch so no text or SFX is cut off.

I can also click “Add Image To Batch” (moves the first image of the following batch to the end of your current batch). 

This way I can customize what I’m downloading without having to restart the entire process and having to reselect which images are to be combined. 

Also, I’m aware the UI for the BATCH versions is ugly and messy at the moment. That will change soon once I figure out the rest of the backend. 




Installation Guide: How to Install

Download the html file (either ImageStitcher v1.2.html or ImageStitcher BATCH v2.html) from the “Lia’s Tools” Google Drive folder. 
Keep in mind that any future versions I make will be added to the Drive folder “Lia’s Tools”—so you’ll have to check this folder if you want to download any future updated versions.
Locate the .html file in your file directory (“Finder” if on a Mac).
Right-click the .html file. 
Then click “Open With” and select your browser. I use Chrome.

If the html file saves as a .txt file (might appear as .html.txt) and opens as just html text rather than as a functional script, try:

Right click and attempt to “Rename” the file and then press enter (ensuring its name says .html and not .txt). 
On my Mac, I get the prompt: Are you sure you want to change the extension from “.txt” to “.html”? 
I click “Use .html” 
The link should now work (assuming you clicked ‘Open With’ your browser of choice, in my case, Chrome)

FYI: This problem only seems to occur if you accidentally opened the .html file as a text file originally (which can happen if your system is set to default open with/as text). 



