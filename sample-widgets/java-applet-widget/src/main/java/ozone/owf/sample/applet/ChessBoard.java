package ozone.owf.sample.applet;
//--------------------------------------------------------------------------------------
// ChessBoard.java
//
// This is the main source file for the MyChessViewer applet which plays over chess
// games stored in the Portable Game Notation (PGN) standard.
//
// Author - Michael Keating
//--------------------------------------------------------------------------------------

import java.applet.Applet;
import java.awt.Button;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.MediaTracker;
import java.awt.MenuItem;
import java.awt.Point;
import java.awt.PopupMenu;
import java.awt.TextArea;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.StringTokenizer;
import java.util.Vector;
import java.util.zip.ZipInputStream;

import javax.swing.ImageIcon;

import sun.plugin.javascript.JSObject;

public class ChessBoard extends Applet implements MouseListener, MouseMotionListener, Runnable, ActionListener, ItemListener, WindowListener
{
	private static final long serialVersionUID = -1643046262117578746L;

	final String NAGStrings[] = {	"null annotation",
									"Good move (!)",
									"Poor move (?)",
									"Excellent or brilliant move (!!)",
									"Very poor move/blunder (??)",
									"Speculative move (!?)",
									"Questionable move (?!)",
									"Forced move (all others lose quickly)",
									"Singular move (no reasonable alternatives)",
									"Worst move",
									"Drawish position",
									"Equal chances, quiet position (=)",
									"Equal chances, active position",
									"Unclear position",
									"White has a slight advantage (+=)",
									"Black has a slight advantage (=+)",
									"White has a moderate advantage (+/-)",
									"Black has a moderate advantage (-/+)",
									"White has a decisive advantage (+-)",
									"Black has a decisive advantage (-+)",
									"White has a crushing advantage (+--)",
									"Black has a crushing advantage (--+)",
									"White is in zugzwang",
									"Black is in zugzwang",
									"White has a slight space advantage",
									"Black has a slight space advantage",
									"White has a moderate space advantage",
									"Black has a moderate space advantage",
									"White has a decisive space advantage",
									"Black has a decisive space advantage",
									"White has a slight time (development) advantage",
									"Black has a slight time (development) advantage",
									"White has a moderate time (development) advantage",
									"Black has a moderate time (development) advantage",
									"White has a decisive time (development) advantage",
									"Black has a decisive time (development) advantage",
									"White has the initiative",
									"Black has the initiative",
									"White has a lasting initiative",
									"Black has a lasting initiative",
									"White has the attack",
									"Black has the attack",
									"White has insufficient compensation for material deficit",
									"Black has insufficient compensation for material deficit",
									"White has sufficient compensation for material deficit",
									"Black has sufficient compensation for material deficit",
									"White has more than adequate compensation for material deficit",
									"Black has more than adequate compensation for material deficit",
									"White has a slight center control advantage",
									"Black has a slight center control advantage",
									"White has a moderate center control advantage",
									"Black has a moderate center control advantage",
									"White has a decisive center control advantage",
									"Black has a decisive center control advantage",
									"White has a slight kingside control advantage",
									"Black has a slight kingside control advantage",
									"White has a moderate kingside control advantage",
									"Black has a moderate kingside control advantage",
									"White has a decisive kingside control advantage",
									"Black has a decisive kingside control advantage",
									"White has a slight queenside control advantage",
									"Black has a slight queenside control advantage",
									"White has a moderate queenside control advantage",
									"Black has a moderate queenside control advantage",
									"White has a decisive queenside control advantage",
									"Black has a decisive queenside control advantage",
									"White has a vulnerable first rank",
									"Black has a vulnerable first rank",
									"White has a well-protected first rank",
									"Black has a well-protected first rank",
									"White has a poorly protected king",
									"Black has a poorly protected king",
									"White has a well-protected king",
									"Black has a well-protected king",
									"White has a poorly placed king",
									"Black has a poorly placed king",
									"White has a well-placed king",
									"Black has a well-placed king",
									"White has a very weak pawn structure",
									"Black has a very weak pawn structure",
									"White has a moderately weak pawn structure",
									"Black has a moderately weak pawn structure",
									"White has a moderately strong pawn structure",
									"Black has a moderately strong pawn structure",
									"White has a very strong pawn structure",
									"Black has a very strong pawn structure",
									"White has poor knight placement",
									"Black has poor knight placement",
									"White has good knight placement",
									"Black has good knight placement",
									"White has poor bishop placement",
									"Black has poor bishop placement",
									"White has good bishop placement",
									"Black has good bishop placement",
									"White has poor rook placement",
									"Black has poor rook placement",
									"White has good rook placement",
									"Black has good rook placement",
									"White has poor queen placement",
									"Black has poor queen placement",
									"White has good queen placement",
									"Black has good queen placement",
									"White has poor piece coordination",
									"Black has poor piece coordination",
									"White has good piece coordination",
									"Black has good piece coordination",
									"White has played the opening very poorly",
									"Black has played the opening very poorly",
									"White has played the opening poorly",
									"Black has played the opening poorly",
									"White has played the opening well",
									"Black has played the opening well",
									"White has played the opening very well",
									"Black has played the opening very well",
									"White has played the middlegame very poorly",
									"Black has played the middlegame very poorly",
									"White has played the middlegame poorly",
									"Black has played the middlegame poorly",
									"White has played the middlegame well",
									"Black has played the middlegame well",
									"White has played the middlegame very well",
									"Black has played the middlegame very well",
									"White has played the ending very poorly",
									"Black has played the ending very poorly",
									"White has played the ending poorly",
									"Black has played the ending poorly",
									"White has played the ending well",
									"Black has played the ending well",
									"White has played the ending very well",
									"Black has played the ending very well",
									"White has slight counterplay",
									"Black has slight counterplay",
									"White has moderate counterplay",
									"Black has moderate counterplay",
									"White has decisive counterplay",
									"Black has decisive counterplay",
									"White has moderate time control pressure",
									"Black has moderate time control pressure",
									"White has severe time control pressure",
									"Black has severe time control pressure",
									"With the idea",
									"Aimed against",
									"Better is this",
									"Worse is this",
									"Equivalent is this",
									"Editor's remark",
									"Novelty",
									"Weak point",
									"Endgame",
									"Line",
									"Diagonal",
									"White has pair of bishops",
									"Black has pair of bishops",
									"Bishops of opposite color",
									"Bishops of same color",
									"White has united pawns",
									"Black has united pawns",
									"White has separated pawns",
									"Black has separated pawns",
									"White has doubled pawns",
									"Black has doubled pawns",
									"White has passed pawn",
									"black has passed pawn",
									"White has adv. in no. pawns",
									"Black has adv. in no. pawns"};

    final int squareWidth         = 45;
    final int squareHeight        = 45;
    final int leftMargin          = squareWidth  / 2 + 3;
    final int rightMargin         = squareWidth  / 2 + 3;
    final int topMargin           = squareHeight / 2 + 3;
    final int bottomMargin        = squareHeight / 2 + 3;
    final int boardWidth          = (squareWidth  * 8) + (leftMargin * 2);
    final int boardHeight         = (squareHeight * 8) + (topMargin  * 2);
    final int rightSpaceLeft      = boardWidth;
    final int rightSpaceTop       = 0;
    final int rightSpaceWidth     = 220;
    final int rightSpaceHeight    = boardHeight;
    final int tagBoxHeight        = 25;
    final int moveLines           = 20;
    final int scoreSheetLeft      = rightSpaceLeft   + 5;
    final int scoreSheetTop       = rightSpaceTop    + 5;
    final int scoreSheetWidth     = rightSpaceWidth  - 10;
    final int scoreSheetHeight    = rightSpaceHeight - 10;
    final int scoreSheetRight     = scoreSheetLeft   + scoreSheetWidth;
    final int scoreSheetMovesTop  = scoreSheetTop  + (tagBoxHeight * 4);
    final int scoreSheetMiddle    = scoreSheetLeft + (scoreSheetWidth / 2);
    final int boxForMoveNumsWidth = 20;
    final int moveBoxHeight       = (scoreSheetHeight - (tagBoxHeight  * 4)) / moveLines;
    final int moveBoxWidth        = ((scoreSheetWidth / 2) - boxForMoveNumsWidth) / 2;
    final int whitesLeftColLeft   = scoreSheetLeft     + boxForMoveNumsWidth;
    final int whitesRightColLeft  = scoreSheetMiddle   + boxForMoveNumsWidth;
    final int blacksLeftColLeft   = whitesLeftColLeft  + moveBoxWidth;
    final int blacksRightColLeft  = whitesRightColLeft + moveBoxWidth;
    final int bottomSpaceLeft     = 0;
    final int bottomSpaceTop      = topMargin + (squareHeight * 8) + bottomMargin;
    final int bottomSpaceWidth    = boardWidth + rightSpaceWidth;
    final int bottomSpaceHeight   = 150;

    int      pieceOffsetX;
    int      pieceOffsetY;
    int      squarePressed;
    int      animatedPieceX, animatedPieceY;
    int      animatedPieceOldX, animatedPieceOldY;
    int      draggedPieceX, draggedPieceY;
    int      draggedPieceToMouseX, draggedPieceToMouseY;
    int      animatedSourceSquare;
    int      animatedDestSquare;
    int      iKilobytesDownloaded;
    int      intLastRAVMoveIndex;
    int      intRefreshInterval;
    char     animatedSquare;
    char     animatedPiece;
    char     draggedPiece;
    char     animationPosition[];
    Color    squareLightColor, squareDarkColor, backgroundColor;
    boolean  whiteFromBottom;
    boolean  isDraggingOn;
    boolean  isReadingPGN;
    boolean  isAnimation;
    boolean  bWhiteToMove;
    boolean  bInitError;
    boolean  showPGNGameList;
    boolean  bIsDownloading;
    boolean  bAnimateMoves;
    boolean  bWaitForFrameToPaint;
    boolean  bPaintBoardOnly;
    boolean  bPuzzleMode;
    boolean  bShowAnswer;
    boolean  bShowSideOnMove;
    boolean  bWindowClosed;
    boolean  bWidget;
    Image    wPawnImage, wKnightImage, wBishopImage, wRookImage, wQueenImage, wKingImage,
             bPawnImage, bKnightImage, bBishopImage, bRookImage, bQueenImage, bKingImage;
    Image    offImage;
    Vector   pgnGames;
    Vector   pgnGameTagsVector;
    java.awt.List     pgnGameList;
    java.awt.List     RAVList;
    Button   pgnButtonNext;
    Button   pgnButtonPrev;
    Button   pgnButtonStart;
    Button   pgnButtonEnd;
    Button   preferencesButton;
    Button   btnShowAnswer;
    String   strInitErrorMessage;
    String   strCurrentVariation;
    String	 openingComment;
    ChessScoreKeeper scoreKeeper;
    Thread   animationThread;
    TextArea commentWindow;

    PgnGameTags currentGameTags;

    PopupMenu preferencesMenu;
    MenuItem  miFlipBoard;
    MenuItem  miAnimateMoves;
    MenuItem  miShowGamesList;

    public void init()
    {
        whiteFromBottom      = true;
        isDraggingOn         = false;
        isReadingPGN         = true;
        showPGNGameList      = false;
        bWhiteToMove         = true;
        bInitError           = false;
        bIsDownloading       = false;
        bAnimateMoves        = true;
        bWaitForFrameToPaint = false;
        bPaintBoardOnly      = false;
        bPuzzleMode          = getParameter("puzzlemode") != null && getParameter("puzzlemode").equals("on");
        bShowAnswer          = false;
        bShowSideOnMove      = false;
        bWindowClosed        = false;
        bWidget              = false;
        animatedSourceSquare = -1;
        animatedDestSquare   = -1;
        strInitErrorMessage  = "";
        intLastRAVMoveIndex  = 10000;

        // get the light square colors

        if (getParameter("lightSquares") == null)
        {
            squareLightColor = new Color(0xf0f0b8);
        }
        else
        {
            try
            {
                squareLightColor = new Color(Integer.parseInt(getParameter("lightSquares"), 16));
            }
            catch (Exception e)
            {
                squareLightColor = new Color(0xf0f0b8);
            }
        }

        // get the dark square colors

        if (getParameter("darkSquares") == null)
        {
            squareDarkColor  = new Color(0x009000);
        }
        else
        {
            try
            {
                squareDarkColor = new Color(Integer.parseInt(getParameter("darkSquares"), 16));
            }
            catch (Exception e)
            {
                squareDarkColor  = new Color(0x009000);
            }
        }

        // get the background color

        if (getParameter("background") == null)
        {
            backgroundColor = new Color(0x007000);
        }
        else
        {
            try
            {
                backgroundColor = new Color(Integer.parseInt(getParameter("background"), 16));
            }
            catch (Exception e)
            {
                backgroundColor = new Color(0x007000);
            }
        }

        // get the PGN file refresh interval

        if (getParameter("RefreshInterval") == null)
        {
            intRefreshInterval = 0;
        }
        else
        {
            try
            {
                intRefreshInterval = Integer.parseInt(getParameter("RefreshInterval"));
            }
            catch (Exception e)
            {
                intRefreshInterval = 0;
            }
        }
        
        if (getParameter("widget") != null&& getParameter("widget").equalsIgnoreCase("true")) {
        		bWidget = true;
        }

        setLayout(null);

        // get our images

        MediaTracker tracker;

        tracker      = new MediaTracker(this);
        wPawnImage   = new ImageIcon(this.getClass().getResource("/images/wp.gif")).getImage();
                       tracker.addImage(wPawnImage, 0);
        wKnightImage = new ImageIcon(this.getClass().getResource("/images/wn.gif")).getImage();
                       tracker.addImage(wKnightImage, 0);
        wBishopImage = new ImageIcon(this.getClass().getResource("/images/wb.gif")).getImage();
                       tracker.addImage(wBishopImage, 0);
        wRookImage   = new ImageIcon(this.getClass().getResource("/images/wr.gif")).getImage();
                       tracker.addImage(wRookImage, 0);
        wQueenImage  = new ImageIcon(this.getClass().getResource("/images/wq.gif")).getImage();
                       tracker.addImage(wQueenImage, 0);
        wKingImage   = new ImageIcon(this.getClass().getResource("/images/wk.gif")).getImage();
                       tracker.addImage(wKingImage, 0);
        bPawnImage   = new ImageIcon(this.getClass().getResource("/images/bp.gif")).getImage();
                       tracker.addImage(bPawnImage, 0);
        bKnightImage = new ImageIcon(this.getClass().getResource("/images/bn.gif")).getImage();
                       tracker.addImage(bKnightImage, 0);
        bBishopImage = new ImageIcon(this.getClass().getResource("/images/bb.gif")).getImage();
                       tracker.addImage(bBishopImage, 0);
        bRookImage   = new ImageIcon(this.getClass().getResource("/images/br.gif")).getImage();
                       tracker.addImage(bRookImage, 0);
        bQueenImage  = new ImageIcon(this.getClass().getResource("/images/bq.gif")).getImage();
                       tracker.addImage(bQueenImage, 0);
        bKingImage   = new ImageIcon(this.getClass().getResource("/images/bk.gif")).getImage();
                       tracker.addImage(bKingImage, 0);

        // wait for those images

        try
        {
            tracker.waitForAll();
        }
        catch (Exception e)
        {
            strInitErrorMessage = e.toString();
            bInitError = true;
            return;
        }

        pieceOffsetX     = (squareWidth / 2) - (wPawnImage.getWidth(this) / 2);
        pieceOffsetY     = squareHeight - wPawnImage.getHeight(this);
        squarePressed    = -1;
        scoreKeeper      = new ChessScoreKeeper();

        // add listeners

        addMouseListener(this);
        addMouseMotionListener(this);

        // Initialize Tags

        currentGameTags = new PgnGameTags();

        currentGameTags.event       = "";
        currentGameTags.site        = "";
        currentGameTags.date        = "";
        currentGameTags.round       = "";
        currentGameTags.white       = "";
        currentGameTags.black       = "";
        currentGameTags.whiteRating = "";
        currentGameTags.blackRating = "";
        currentGameTags.result      = "";
        currentGameTags.ECOCode     = "";
        currentGameTags.FEN         = "";

        // add the comment window

        commentWindow = new TextArea();
        commentWindow.setBounds(bottomSpaceLeft + 10, bottomSpaceTop + 10, boardWidth - 20, bottomSpaceHeight - 20);
        commentWindow.setFont(new Font("SansSerif", Font.PLAIN, 13));
        commentWindow.setVisible(false);
        add(commentWindow);

        // add the RAV (variations) list

        RAVList = new java.awt.List();
        RAVList.setFont(new Font("SansSerif", Font.PLAIN, 12));
        RAVList.setSize(60,60);
        RAVList.setVisible(false);
        RAVList.addItemListener(this);
        add(RAVList);
    }

    public void stop()
    {
        // this stops the refresher thread (stops re-getting the pgn file)
        bWindowClosed = true;
    }

	public void destroy()
	{
		// this stops the refresher thread (stops re-getting the pgn file)
		bWindowClosed = true;
	}

    private void initPGN(boolean bFirstRead)
    {
        URL            pgnFileURL     = null;
        InputStream    pgnInputStream = null;
        ZipInputStream zipInputStream = null;
        BufferedReader pgnReader      = null;
        int            intGameNumber  = 0;

        // create and initialize gameTages
        PgnGameTags gameTags = new PgnGameTags();
        gameTags.event       = "";
        gameTags.site        = "";
        gameTags.date        = "";
        gameTags.round       = "";
        gameTags.white       = "";
        gameTags.black       = "";
        gameTags.whiteRating = "";
        gameTags.blackRating = "";
        gameTags.result      = "";
        gameTags.ECOCode     = "";
        gameTags.FEN         = "";

        // create the vectors that will hold our games and Tags

        if (bFirstRead)
        {
            pgnGames          = new Vector();
            pgnGameTagsVector = new Vector();
        }

        // get and open the pgn file

        try
        {
            pgnFileURL = new URL(getCodeBase(), getParameter("pgngamefile"));
        }
        catch (Exception e)
        {
            strInitErrorMessage = e.toString();
            bInitError = true;
            return;
        }

        if (getParameter("pgngamefile").endsWith(".zip") ||
            getParameter("pgngamefile").endsWith(".ZIP"))
        {
            try
            {
                zipInputStream = new ZipInputStream(pgnFileURL.openStream());
            }
            catch (Exception e)
            {
                strInitErrorMessage = e.toString();
                bInitError = true;
                return;
            }

            // position the stream on the entry data

            try
            {
                zipInputStream.getNextEntry();
            }
            catch (Exception e)
            {
                strInitErrorMessage = e.toString();
                bInitError = true;
                return;
            }

            pgnReader  = new BufferedReader(new InputStreamReader(zipInputStream));
        }
        else
        {
            try
            {
                pgnInputStream = pgnFileURL.openStream();
            }
            catch (Exception e)
            {
                strInitErrorMessage = e.toString();
                bInitError = true;
                return;
            }

            pgnReader  = new BufferedReader(new InputStreamReader(pgnInputStream));
        }

        // parse the pgn file for the game list

        String  lineOfText         = null;
        String  moveText           = "";
        boolean bIsReadingTagPairs = false;
        boolean bIsReadingMoveText = false;
        int     intGameCount       = 0;

        // when bIsDownLoading is true the message displaying
        // the bytes downloaded is painted - set this to false
        // when refreshing so the user won't be disturbed by
        // the this message

        bIsDownloading             = bFirstRead;
        int iTotalBytesDownloaded  = 0;
        for(;;)
        {
            // get a line of text

            try
            {
                lineOfText = pgnReader.readLine();
            }
            catch (Exception e)
            {
                strInitErrorMessage = e.toString();
                bInitError = true;
                return;
            }

            // end of file?

            if (lineOfText == null)
            {
                break;
            }

            // display the bytes downloaded every 1k bytes

            iTotalBytesDownloaded += lineOfText.length();
            if ((iTotalBytesDownloaded / 1024) != iKilobytesDownloaded)
            {
                iKilobytesDownloaded = iTotalBytesDownloaded / 1024;
                repaint();
            }

            // remove any leading or trailing white spaces

            lineOfText = lineOfText.trim();

            // blank line?

            if (lineOfText.length() == 0)
            {
                continue;
            }

            if (lineOfText.charAt(0) != '[')
            {
                // are we at the end of a tag-pair section?

                if (bIsReadingTagPairs)
                {
                    ++intGameNumber;

                    String pgnGameString = intGameNumber   + ". "   +
                                           gameTags.white  + " vs " +
                                           gameTags.black  + ", "   + "\"" + 
						                   gameTags.result + "\", " + 
						                   gameTags.date;

                    if (!gameTags.event.equals("?") && !gameTags.event.equals(""))
                    {
                        pgnGameString += (", " + gameTags.event);
                    }

                    if (!gameTags.site.equals("?") && !gameTags.site.equals(""))
                    {
                        pgnGameString += (", " + gameTags.site);
                    }

                    // if this is the first read, add the game

                    if (bFirstRead)
                    {
                        pgnGameList.add(pgnGameString);
                        pgnGameList.setVisible(false);
                        pgnGameTagsVector.addElement((PgnGameTags)gameTags.clone());
                    }

                    // if this is a refresh and it is an additional
                    // game add it

                    else if (intGameNumber > pgnGameTagsVector.size())
                    {
                        pgnGameList.add(pgnGameString);
                        pgnGameTagsVector.addElement((PgnGameTags)gameTags.clone());
                    }

                    // if this is a refresh and this is a different game
                    // replace it

                    else if (!pgnGameString.equals(pgnGameList.getItem(intGameNumber - 1)))
                    {
                        pgnGameList.replaceItem(pgnGameString, intGameNumber - 1);
                        pgnGameTagsVector.setElementAt((PgnGameTags)gameTags.clone(), intGameNumber - 1);
                    }

                    // erase our gameTags

                    gameTags.event       = "";
                    gameTags.site        = "";
                    gameTags.date        = "";
                    gameTags.round       = "";
                    gameTags.white       = "";
                    gameTags.black       = "";
                    gameTags.whiteRating = "";
                    gameTags.blackRating = "";
                    gameTags.result      = "";
                    gameTags.ECOCode     = "";
                    gameTags.FEN         = "";

                    // set this to false because the next blank
                    // line we are about to find will be at the end
                    // of the game moves.

                    bIsReadingTagPairs = false;

                    // this is the first line of the moveText section

                    moveText = "";
                    bIsReadingMoveText = true;
                }

                if (bIsReadingMoveText)
                {
                    // add the line to our game text

                    moveText += lineOfText + '\n';

                    // look for the end-of-game marker (1-0, 0-1, 1/2-1/2, or *)

                    if (lineOfText.endsWith("1-0")     ||
                        lineOfText.endsWith("0-1")     ||
                        lineOfText.endsWith("1/2-1/2") ||
                        lineOfText.endsWith("*"))
                    {
                        // if this is the first read, add the game

                        if (bFirstRead)
                        {
                            pgnGames.addElement(moveText);
                        }

                        // if this is a refresh and it is an additional
                        // game add it

                        else if (intGameNumber > pgnGames.size())
                        {
                            pgnGames.addElement(moveText);
                        }

                        // if this is a refresh and this is a different game
                        // replace it

                        else if (!moveText.equals((String)pgnGames.elementAt(intGameNumber - 1)))
                        {
                            pgnGames.setElementAt(moveText, intGameNumber - 1);
                        }

                        bIsReadingMoveText = false;
                        ++intGameCount;
                    }
                }

                continue;
            }

            bIsReadingTagPairs = true;

            // get game tags

            String param, value;
            param = lineOfText.substring(lineOfText.indexOf('[') + 1, lineOfText.indexOf('"'));
            value = lineOfText.substring(lineOfText.indexOf('"') + 1, lineOfText.lastIndexOf('"'));
            param = param.trim();
            value = value.trim();

            if (param.equals("Event"))
            {
                gameTags.event = value;
            }
            else if (param.equals("Site"))
            {
                gameTags.site = value;
            }
            else if (param.equals("Date"))
            {
                // convert yyyy.mm.dd to mm-dd-yyyy

                int iFirstDot  = value.indexOf('.');
                int iSecondDot = value.lastIndexOf('.');

                if (iFirstDot != -1 && iSecondDot != -1)
                {
                    gameTags.date = value.substring(iFirstDot + 1, iSecondDot)      + '-' +
                                           value.substring(iSecondDot + 1, value.length()) + '-' +
                                           value.substring(0, iFirstDot);
                }
                else
                {
                    gameTags.date = value;
                }
            }
            else if (param.equals("Round"))
            {
                gameTags.round = value;
            }
            else if (param.equals("White"))
            {
                gameTags.white = value;
            }
            else if (param.equals("Black"))
            {
                gameTags.black = value;
            }
            else if (param.equals("WhiteElo"))
            {
                gameTags.whiteRating = value;
            }
            else if (param.equals("BlackElo"))
            {
                gameTags.blackRating = value;
            }
            else if (param.equals("Result"))
            {
                gameTags.result = value;
            }
            else if (param.equals("ECO"))
            {
                gameTags.ECOCode = value;
            }
            else if (param.equals("FEN"))
            {
                gameTags.FEN = value;
            }
        }

        // close the stream

        try
        {
            pgnReader.close();
        }
        catch (Exception e)
        {
            strInitErrorMessage = e.toString();
            bInitError = true;
            return;
        }

        if (bFirstRead)
        {
            if (intGameCount == 1)
            {
                showPGNGameList = false;
                readPGNGame(0, false);
            }
             else
            {
                showPGNGameList = true;
            }

            bIsDownloading  = false;
            repaint();

            // set up our "Preferences" popup menu

            preferencesMenu = new PopupMenu();

            miAnimateMoves = new MenuItem("Turn Animation Off");
            miAnimateMoves.addActionListener(this);
            miAnimateMoves.setFont(new Font("Dialog", Font.PLAIN, 12));

            miFlipBoard = new MenuItem("Flip Board");
            miFlipBoard.addActionListener(this);
            miFlipBoard.setFont(new Font("Dialog", Font.PLAIN, 12));

            miShowGamesList = new MenuItem("Hide Games List");
            miShowGamesList.addActionListener(this);
            miShowGamesList.setFont(new Font("Dialog", Font.PLAIN, 12));

            preferencesMenu.add(miAnimateMoves);
            preferencesMenu.add(miFlipBoard);
            preferencesMenu.add(miShowGamesList);

            add(preferencesMenu);
        }
        else
        {
            // this is a refresh - call readPGNGame

            if (intGameCount == 1)
            {
                readPGNGame(0, true);
            }
            else
            {
                readPGNGame(pgnGameList.getSelectedIndex(), true);
            }
        }
    }

    private void readPGNGame(int gameNumber, boolean bIsRefresh)
    {
        // new game

        String theGame = "";
        String strComment = "";

        try
        {
            PgnGameTags tempTags = (PgnGameTags)pgnGameTagsVector.elementAt(gameNumber);
            currentGameTags = (PgnGameTags)tempTags.clone();
        }
        catch (ArrayIndexOutOfBoundsException e)
        {
            return;
        }

        try
        {
            theGame = new String((String)pgnGames.elementAt(gameNumber));
        }
        catch (ArrayIndexOutOfBoundsException e)
        {
            return;
        }

        ChessScoreKeeper tempScoreKeeper = new ChessScoreKeeper();

        // set the position if there is a FEN position;

        if (currentGameTags.FEN != null && !currentGameTags.FEN.equals(""))
        {
            tempScoreKeeper.setFEN(currentGameTags.FEN);
            whiteFromBottom = bWhiteToMove = tempScoreKeeper.isWhitesMove();

            // let the user know who is on move if we're in puzzle mode

            bShowSideOnMove = bPuzzleMode;
        }

        // add a space to the end of the game string (helps our parsing)

        theGame  = theGame.trim();
        theGame += " "; 

        // parse that game!

        String  gameToken      = "";
        String  strMove        = "";
        boolean bIsCommentText = false;
        boolean bNewRAV        = false;
        Vector  vRAVPoint      = new Vector();
        FontMetrics fm         = commentWindow.getFontMetrics(commentWindow.getFont());
        for (int i = 0; i < theGame.length(); i++)
        {
            // all substrings are separated by a space

            if (Character.isWhitespace(theGame.charAt(i)))
            {
                // look for a real game move

                if (gameToken.length()  > 0      &&
                    gameToken.indexOf('}') == -1 &&
                    gameToken.indexOf(')') == -1 &&
                    bIsCommentText   == false    &&
                   (Character.isLetter(gameToken.charAt(0)) ||
                    gameToken.equals("0-0")      ||
                    gameToken.equals("0-0-0")    ||
                    gameToken.equals("1-0")      ||
                    gameToken.equals("1-0")      ||
                    gameToken.equals("1-0")      ||
                    gameToken.equals("1-0")      ||
                    gameToken.equals("0-1")      ||
                    gameToken.equals("1/2-1/2")  ||
                    gameToken.equals("*")))
                {
                    // this is a pgn move. Run it through and store it in the scoreKeeper
                    // (any valid move is at least 2 characters - except an asterisk *)

                    if (gameToken.length() > 1 || gameToken.equals("*"))
                    {
                        strMove = gameToken;

                        if (!tempScoreKeeper.makeMove(strMove, bNewRAV))
                        {
                            // illegal move - this game has been cut short

                            tempScoreKeeper.gotoPosition(0);
                            return;
                        }

                        // bNewRAV should always be false at this point

                        bNewRAV = false;
                    }
                }

                // get any comments that we might have

                else if (bIsCommentText)
                {
                    // this is a white character (probabaly a space)
                    // don't add the space if this is the first character
                    // of a new line (looks lousy)

                    if (strComment.lastIndexOf('\n') == strComment.length() - 1)
                    {
                        continue;
                    }

                    // add the space. Since we do our own word-wrapping, convert all
                    // white spaces to spaces

                    strComment += " ";

                    // do a little word-wrap hackage here

                    String strCommentLine;
                    if (strComment.lastIndexOf('\n') != -1)
                    {
                        strCommentLine = strComment.substring(strComment.lastIndexOf('\n') + 1, strComment.length());
                    }
                    else
                    {
                        strCommentLine = strComment.substring(0, strComment.length());
                    }

                    if (fm.stringWidth(strCommentLine) > commentWindow.getSize().width - fm.stringWidth("12345678"))
                    {
                        strComment += '\n';
                    }
                }

                // look for NAGs (Numeric Annotation Glyphs)

                else if (gameToken.length() > 1 && gameToken.charAt(0) == '$')
                {
                    int intNAGIndex;
                    try
                    {
                        intNAGIndex = Integer.parseInt(gameToken.substring(1, gameToken.length()));
                    }
                    catch (Exception e)
                    {
                        intNAGIndex = 0;
                    }

                    if (intNAGIndex < NAGStrings.length)
                    {
                    	// Add Nag String - Only add a ' - ' if there is alreay a comment
                        ChessMove cm = tempScoreKeeper.getChessMoveAt(tempScoreKeeper.getCurrentMoveIndex() - 1);
                        cm.setComment(cm.getComment() + (cm.getComment().length() > 0 ? " - " : "") + NAGStrings[intNAGIndex]);
                    }
                }

                gameToken = "";
            }
            else
            {
                // are we begining or ending a comment?

                if (theGame.charAt(i) == '{')
                {
                    bIsCommentText = true;
                    continue;
                }
                else if (theGame.charAt(i) == '}')
                {
                    // add the comment to the last chess move
                    // first remove the braces

                    if (strComment.length() > 0)
                    {
                    	if (!bNewRAV)
                    	{
                        	// attach the comment to the current move, before any pre-existing comment (i.e. NAG move)
                        	// NB. will handle comment before first move differently
                        	if ( tempScoreKeeper.getCurrentMoveIndex()>0 )
                        	{
								ChessMove cm = tempScoreKeeper.getChessMoveAt(tempScoreKeeper.getCurrentMoveIndex() - 1);							
								cm.setComment(strComment + (cm.getComment().length() > 0 ? " - " : "") + cm.getComment());
							}
							else
							{
								// Make a note of opening comment as we will
								// attach this to the first move's comment.
								openingComment = strComment;
							}
						}
                    }

                    strComment = "";
                    bIsCommentText = false;
                    continue;
                }
                else if (bIsCommentText)
                {
                    strComment += theGame.charAt(i);
                    continue;
                }

                // are we starting a variation?

                if (theGame.charAt(i) == '(')
                {
                    // we are starting a new RAV (line)
                    // get the current index (we'll be returning here

                    int intIndexPoint = tempScoreKeeper.getCurrentMoveIndex();

                    // get the key of the last move

                    String strKey = tempScoreKeeper.getMoveKey(intIndexPoint - 1);

                    // get the color on move

                    String strOnMove = tempScoreKeeper.isWhitesMove() ? "white" : "black";

                    // "push" the index point and key on the vRAVPoint vector

                    vRAVPoint.addElement(intIndexPoint + " " + strKey + " " + strOnMove);

                    bNewRAV = true;

                    gameToken = "";
                    continue;
                }
                else if (theGame.charAt(i) == ')')
                {
                    // is this attached to the final variation move? ie - 'Nf3)'

                    if (gameToken.length() > 1 && Character.isLetter(gameToken.charAt(0)))
                    {
                        tempScoreKeeper.makeMove(gameToken, bNewRAV);
                    }

                    // look for NAGs (Numeric Annotation Glyphs) ie - '$18)

                    else if (gameToken.length() > 1 && gameToken.charAt(0) == '$')
                    {
                        int intNAGIndex;
                        try
                        {
                            intNAGIndex = Integer.parseInt(gameToken.substring(1, gameToken.length()));
                        }
                        catch (Exception e)
                        {
                            intNAGIndex = 0;
                        }

                        if (intNAGIndex < NAGStrings.length)
                        {
                        	// Add Nag String - Only add a ' - ' if there is alreay a comment
                            ChessMove cm = tempScoreKeeper.getChessMoveAt(tempScoreKeeper.getCurrentMoveIndex() - 1);
                            cm.setComment(cm.getComment() + (cm.getComment().length() > 0 ? " - " : "") + NAGStrings[intNAGIndex]);
                        }
                    }

                    // mave sure we unset bNewRAV at this point

                    bNewRAV = false;

                    // end this line whith a "*"

                    tempScoreKeeper.makeMove("*", false);

                    // we just finished a RAV (line)
                    // jump back to our RAVpoint - "pop" it off vRAVPoint

                    String strRAVPoint = (String)vRAVPoint.lastElement();
                    vRAVPoint.removeElementAt(vRAVPoint.size() - 1);

                    // get our RAVPoint index and key and color on move

                    int    intIndex     = Integer.parseInt(strRAVPoint.substring(0, strRAVPoint.indexOf(' ')));
                    String strKey       = strRAVPoint.substring(strRAVPoint.indexOf(' ') + 1, strRAVPoint.lastIndexOf(' '));
                    String strColor     = strRAVPoint.substring(strRAVPoint.lastIndexOf(' ') + 1, strRAVPoint.length());
                    boolean bWhitesMove = strColor.equals("white");

                    // have the scorekeeper reset the line

                    tempScoreKeeper.setLine(intIndex, strKey, bWhitesMove);

                    gameToken = "";
                    continue;
                }

                // some PGN games don't add a space after the move number: '1.e4 '
                // instead of the usual '1. e4' - deal with it!

                else if (theGame.charAt(i) == '.')
                {
                    gameToken = "";
                    continue;
                }

                // add the character to our game token

                gameToken += theGame.charAt(i);
            }
        }

        // if this is a refresh and the games has changed
        // setup the new game to tempScoreKeeper

        if (bIsRefresh && !scoreKeeper.equals(tempScoreKeeper))
        {
            if (tempScoreKeeper.getTotalMoves() >= scoreKeeper.getTotalMoves())
            {
                tempScoreKeeper.gotoPosition(scoreKeeper.getCurrentMoveIndex());
                scoreKeeper = tempScoreKeeper;
            }
            else
            {
                scoreKeeper = tempScoreKeeper;
                scoreKeeper.gotoPosition(0);
            }

            repaint();
        }

        // if this is a new game goto the start
        // if this is a new game.

        else if (!bIsRefresh)
        {
            scoreKeeper = tempScoreKeeper;
            scoreKeeper.gotoPosition(0);
        }
        
        if (bWidget) {
        	scoreKeeper.gotoPosition(getCurrentPosition());
        }
    }

    // this function updates the scoresheet by checking to see if the PGN
    // file has changed.   A web programmer can use this funtionality by
    // passing the parameter "RefreshInterval" with a value that specifies
    // the seconds to wait between refreshes.

    private void startRefresher()
    {
        if (intRefreshInterval == 0)
        {
            return;
        }

        initPGN(true);

        while (!bWindowClosed)
        {
            // sleep for the specified interval

            try
            {
                Thread.sleep(intRefreshInterval * 1000);
            }
            catch (Exception e)
            {
            }

            initPGN(false);
        }
    }

    private synchronized void animateMove()
    {
        final int   factor       = 5;
        int         fraction     = 1;
        Vector      framesVector = new Vector(factor * 2);
        final Point startPoint   = squareNumberToPoint(animatedSourceSquare);
        final Point endPoint     = squareNumberToPoint(animatedDestSquare);
        Point       midPoint     = new Point();

        // This logic is taken from Winboard.  The piece moves
        // in slow and speeds up towards the middle, then slows
        // down again toward the end.

        startPoint.x += pieceOffsetX;
        startPoint.y += pieceOffsetY;
        endPoint.x   += pieceOffsetX;
        endPoint.y   += pieceOffsetY;

        if (animatedPiece != 'N' && animatedPiece != 'n')
        {
            // all pieces, except knights, move in a straight line

            midPoint.x    = startPoint.x + ((endPoint.x - startPoint.x) / 2);
            midPoint.y    = startPoint.y + ((endPoint.y - startPoint.y) / 2);
        }
        else
        {
            // knights move straight and then diagonally

            midPoint.x = startPoint.x + (endPoint.x - startPoint.x) / 2;
            midPoint.y = endPoint.y;
        }

        for (int i = 0; i < factor; i++)
        {
            fraction *= 2;
        }

        for (int i = 0; i < factor; i++)
        {
            int x, y;

            // slow to fast - 1/16, 1/8, etc...

            x = startPoint.x + ((midPoint.x - startPoint.x) / fraction);
            y = startPoint.y + ((midPoint.y - startPoint.y) / fraction);
            framesVector.addElement(new Point(x, y));
            fraction /= 2;
        }

        fraction = 2;
        for (int i = 0; i < factor; i++)
        {
            int x, y;

            // fast to slow - 1/16, 1/8, etc...

            x = endPoint.x - ((endPoint.x - midPoint.x) / fraction);
            y = endPoint.y - ((endPoint.y - midPoint.y) / fraction);
            framesVector.addElement(new Point(x, y));
            fraction *= 2;
        }

        // add the final destination point

        framesVector.addElement(endPoint);

        animatedPieceX = -1;
        animatedPieceY = -1;
        long tm = System.currentTimeMillis();
        for (int i = 0; i < framesVector.size(); ++i)
        {
            Point point       = (Point)framesVector.elementAt(i);
            animatedPieceOldX = animatedPieceX;
            animatedPieceOldY = animatedPieceY;
            animatedPieceX    = point.x;
            animatedPieceY    = point.y;

            try
            {
                tm += 15;
                Thread.sleep(Math.max(0, tm - System.currentTimeMillis()));
            }
            catch (InterruptedException e)
            {
            }

            // wait for up to 1/10th of a second for the last frame
            // to finish painting (necessary on slow machines and slow
            // VM's such as Netscape 4.06).  bWaitForFrameToPaint is
            // set to false by update() once the frame is drawn.

            for (int j = 0; j < 20; j++)
            {
                if (!bWaitForFrameToPaint)
                {
                    break;
                }

                try
                {
                    Thread.sleep(5);
                }
                catch (Exception e)
                {
                }
            }

            // setting a lower priority before repainting eliminates flicker
            // it does, however, slow down animation quite a bit - but it's
            // the best I can figure our for now

            Thread.currentThread().setPriority(Thread.currentThread().getPriority() - 1);
            bWaitForFrameToPaint = true;
            repaint();
            Thread.currentThread().setPriority(Thread.currentThread().getPriority() + 1);
        }

        isAnimation = false;

        Thread.currentThread().setPriority(Thread.currentThread().getPriority() - 1);
        bPaintBoardOnly = true;
        repaint();
        Thread.currentThread().setPriority(Thread.currentThread().getPriority() + 1);

        // did the user just press the "next move" button from a puzzle?

        if (bPuzzleMode && !bShowAnswer)
        {
            bShowSideOnMove = false;
            bShowAnswer     = true;
            btnShowAnswer.setVisible(false);
            repaint();
        }
    }

    public void run()
    {
        if (Thread.currentThread().getName().equals("Animation"))
        {
            animateMove();
        }
        else if (Thread.currentThread().getName().equals("InitPgn"))
        {
            initPGN(true);
        }
        else if (Thread.currentThread().getName().equals("startRefresher"))
        {
            startRefresher();
        }
    }

    private void paintAnimation(Graphics g)
    {
        int pieceWidth = wPawnImage.getWidth(this);
        int pieceHeight = wPawnImage.getHeight(this);

        int square1 = xyToSquareNumber(animatedPieceOldX, animatedPieceOldY);
        int square2 = xyToSquareNumber(animatedPieceOldX + pieceWidth, animatedPieceOldY);
        int square3 = xyToSquareNumber(animatedPieceOldX, animatedPieceOldY + pieceHeight);
        int square4 = xyToSquareNumber(animatedPieceOldX + pieceWidth, animatedPieceOldY + pieceHeight);

        // repaint the necessary squares affected by our last animation frame

        repaintSquare(g, square1);
        if (square2 != square1)
        {
            repaintSquare(g, square2);
        }
        if (square3 != square2 && square3 != square1)
        {
            repaintSquare(g, square3);
        }
        if (square4 != square3 && square4 != square2 && square4 != square1)
        {
            repaintSquare(g, square4);
        }

        // now draw the animation piece

        drawPiece(g, animatedPiece, animatedPieceX, animatedPieceY);
    }

    private void repaintSquare(Graphics g, int square)
    {
        if (square < 0 || square > 63)
        {
            return;
        }

        Point point = squareNumberToPoint(square);

        // draw the square

        g.setColor(scoreKeeper.isLightSquare(square) ? squareLightColor : squareDarkColor);
        g.fillRect(point.x, point.y, squareWidth, squareHeight);

        // now draw whatever piece that might be there

        if (animationPosition[square] != '-')
        {
            drawPiece(g, animationPosition[square], point.x + pieceOffsetX, point.y + pieceOffsetY);
        }
    }

    public void update(Graphics g)
    {
        int file, rank;

        file = 1;
        rank = 1;
        Graphics offGraphics;

        if (offImage == null)
        {
            offImage = this.createImage(getSize().width, getSize().height);
        }

        offGraphics  = offImage.getGraphics();

        if (isAnimation)
        {
            paintAnimation(offGraphics);
            g.drawImage(offImage, 0, 0, this);
            bWaitForFrameToPaint = false;
            return;
        }
        else if (bIsDownloading)
        {
            drawMessageBox(offGraphics,
                           "Loading " + getParameter("pgngamefile") +
                           "\nPlease wait..." +
                           "\n(" + iKilobytesDownloaded + "k)",
                           Color.black,
                           Color.cyan,
                           boardWidth  / 2,
                           boardHeight / 2);

            g.drawImage(offImage, 0, 0, this);
            return;
        }

        // set the background to the dark square color

        offGraphics.setColor(squareDarkColor);
        offGraphics.fillRect(0, 0, boardWidth, boardHeight);

        // draw the light squares here (by an inner background rect)

        offGraphics.setColor(squareLightColor);
        offGraphics.fillRect(leftMargin   - 2,
                             topMargin    - 2,
                            (squareWidth  * 8) + 4,
                            (squareHeight * 8) + 4);

        offGraphics.setColor(squareDarkColor);
        for (int i = 0; i < 64; i++)
        {
            // Calculate x, y for the squares

            int x = leftMargin + (squareWidth  * (file - 1));
            int y = topMargin  + (squareHeight * (rank - 1));

            // draw a dark square (white squares are already there - see above)

            if ((file + rank) % 2 != 0)
            {
                offGraphics.fillRect(x, y, squareWidth, squareHeight);
            }

            // draw the piece at this square (if any)

            char position[] = !isAnimation ? scoreKeeper.getCurrentPosition() :
                                             animationPosition;

            char pieceToDraw = whiteFromBottom ? position[i] : position[63 - i];
            drawPiece(offGraphics, pieceToDraw, x + pieceOffsetX, y + pieceOffsetY);

            // next rank ?

            if (file == 8 )
            {
                file = 1;
                ++rank;
            }
            else
            {
                ++file;
            }
        }

        // draw algrebraec notation character markers

        drawNotationMarkers(offGraphics);

        // show any comments we may have

        String strMoveComment = "";
        if (scoreKeeper.getCurrentMoveIndex() > 0)
        {
            strMoveComment = scoreKeeper.getChessMoveAt(scoreKeeper.getCurrentMoveIndex() - 1).getComment();

			// if there is an opening comment - prepend it to the first move's comment
			if (openingComment != null && scoreKeeper.getCurrentMoveIndex() == 1)
				strMoveComment = openingComment + "\n\n" + strMoveComment;

			commentWindow.setText(strMoveComment);
        }

        if (!strMoveComment.equals(""))
        {
            if (pgnGameList.isVisible())
            {
                pgnGameList.setVisible(false);
            }

            commentWindow.setVisible(true);
        }
        else
        {
            commentWindow.setVisible(false);

            if (showPGNGameList)
            {
                pgnGameList.setVisible(true);
            }
        }

        if (bPaintBoardOnly)
        {
            updateHighlightedMove(offGraphics);
            g.drawImage(offImage, 0, 0, this);
            bPaintBoardOnly = false;
            return;
        }

        // draw the rightSpace (scoresheet stuff)

        drawRightSpace(offGraphics);

        // draw the bottom space (where the game list, etc., lives)

        /*if (pgnGameList != null &&
            getComponentAt(bottomSpaceLeft + 4, bottomSpaceTop + 4) != pgnGameList)
        {
            // let the user know it will take a moment to draw the
            // game list and buttons

            drawMessageBox(offGraphics,
                           "One moment...",
                           Color.black,
                           Color.cyan,
                           boardWidth  / 2,
                           boardHeight / 2);

            g.drawImage(offImage, 0, 0, this);
        }*/

        drawBottomSpace(offGraphics);

        // slap down the offscreen image

        g.drawImage(offImage, 0, 0, this);

        if (isReadingPGN && pgnGameList == null)
        {
            pgnGameList = new java.awt.List();
            pgnGameList.addItemListener(this);

            iKilobytesDownloaded = 0;

            if (intRefreshInterval > 0)
            {
                Thread refresherThread = new Thread(this, "startRefresher");
                refresherThread.start();
            }
            else
            {
                Thread initPgnThread = new Thread(this, "InitPgn");
                initPgnThread.start();
            }
        }
    }

    // display the variation list if we have..well..a variation

    private void CheckForRAVS()
    {
        int intMoveIndex = scoreKeeper.getCurrentMoveIndex();

        if (intMoveIndex == intLastRAVMoveIndex)
        {
            return;
        }

        intLastRAVMoveIndex = intMoveIndex;

        // empty the list (list.removall all seems to be broken in EI5)

        while (RAVList.getItemCount() > 0)
        {
            RAVList.remove(0);
        }

        if (intMoveIndex == -1 || scoreKeeper.variationsAt(intMoveIndex) == 0)
        {
            intLastRAVMoveIndex = 10000;
            RAVList.setVisible(false);
            return;
        }

        // add this move's variations

        Vector vRAVS = scoreKeeper.getVariationsAt(intMoveIndex);

        for (int i = 0; i < vRAVS.size(); ++i)
        {
            RAVList.add((String)vRAVS.elementAt(i));			// addItem is deprecated
        }

        RAVList.setVisible(true);
    }

    public void paint(Graphics g)
    {
        update(g);
    }

    void drawNotationMarkers(Graphics g)
    {
        // set font info

        g.setFont(new Font("Dialog", Font.BOLD, 12));
        FontMetrics fm = g.getFontMetrics();

        g.setColor(squareLightColor);

        // draw algrebraec notation characters here

        char fileChar, rankChar;
        for (int i = 0; i < 8; i++)
        {
            if (whiteFromBottom)
            {
                fileChar = (char)('a' + i);
                rankChar = (char)('8' - i);
            }
            else
            {
                fileChar = (char)('h' - i);
                rankChar = (char)('1' + i);
            }

            // draw the file characters (a - h) in the bottom margin

            g.drawString("" + fileChar,
                         leftMargin + (squareWidth * i) +
                                      (squareWidth /2 ) -
                                      (fm.charWidth(fileChar) /2),
                         topMargin  + (squareHeight * 8) + 4 +
                                       fm.getAscent());

            // draw the rank characters (1 - 8) in the left margin

            g.drawString("" + rankChar,
                        (leftMargin - 7) - fm.charWidth(rankChar),
                         topMargin + (squareHeight * i) +
                                     (squareHeight / 2) +
                                     (fm.getAscent() / 2));
        }
    }

    void drawRightSpace(Graphics g)
    {

        // draw the rightSpace's background

        g.setColor(backgroundColor);
        g.fillRect(rightSpaceLeft,
                   rightSpaceTop,
                   rightSpaceWidth,
                   rightSpaceHeight);

        // draw a boarder around that background

        g.setColor(new Color(0x000000));
        g.drawRect(rightSpaceLeft,
                   rightSpaceTop,
                   rightSpaceWidth - 1,
                   rightSpaceHeight);

        // draw pager-like background over the above background

        g.setColor(new Color(0xfffff0));
        g.fillRect(scoreSheetLeft,
                   scoreSheetTop,
                   scoreSheetWidth,
                   scoreSheetHeight);

        // draw a boarder around that background

        g.setColor(new Color(0x000000));
        g.drawRect(scoreSheetLeft,
                   scoreSheetTop,
                   scoreSheetWidth - 1,
                   scoreSheetHeight);


        // draw the scoreSheet form
        // event and year are on the same line

        final int dateTagBoxWidth  = 70;
        final int eventTagBoxWidth = scoreSheetWidth - dateTagBoxWidth;
        final int eventTagBoxLeft  = scoreSheetLeft;
        final int dateTagBoxLeft   = eventTagBoxLeft + eventTagBoxWidth;

        // site, round, result, and ECO code are on this line

        final int ecoTagBoxWidth    = 30;
        final int resultTagBoxWidth = 27;
        final int roundTagBoxWidth  = 20;
        final int siteTagBoxWidth   = scoreSheetWidth - ecoTagBoxWidth - roundTagBoxWidth - resultTagBoxWidth;
        final int siteTagBoxLeft    = scoreSheetLeft;
        final int roundTagBoxLeft   = scoreSheetLeft + siteTagBoxWidth;
        final int resultTagBoxLeft  = scoreSheetLeft + siteTagBoxWidth + roundTagBoxWidth;
        final int ecoTagBoxLeft     = scoreSheetLeft + siteTagBoxWidth + roundTagBoxWidth + resultTagBoxWidth;

        // white player and rating are on this line

        final int whiteRatingTagBoxWidth = 40;
        final int whiteTagBoxWidth       = scoreSheetWidth - whiteRatingTagBoxWidth;
        final int whiteTagBoxLeft        = scoreSheetLeft;
        final int whiteRatingTagBoxLeft  = whiteTagBoxLeft + whiteTagBoxWidth;

        // black player and rating are on this line

        final int blackRatingTagBoxWidth = 40;
        final int blackTagBoxWidth       = scoreSheetWidth - blackRatingTagBoxWidth;
        final int blackTagBoxLeft        = scoreSheetLeft;
        final int blackRatingTagBoxLeft  = blackTagBoxLeft + blackTagBoxWidth;

        // draw the tag labels

        g.setFont(new Font("Monospaced", Font.PLAIN, 9));
        FontMetrics fm = g.getFontMetrics();
        g.setColor(Color.black);

        int y = scoreSheetTop;
        g.drawString("event", eventTagBoxLeft + 1, y + fm.getAscent());
        g.drawString("date",  dateTagBoxLeft  + 1, y + fm.getAscent());

        y += tagBoxHeight;
        g.drawString("site",  siteTagBoxLeft   + 1, y + fm.getAscent());
        g.drawString("rnd",   roundTagBoxLeft  + 1, y + fm.getAscent());
        g.drawString("score", resultTagBoxLeft + 1, y + fm.getAscent());
        g.drawString("eco",   ecoTagBoxLeft    + 1, y + fm.getAscent());

        y += tagBoxHeight;
        g.drawString("white",  whiteTagBoxLeft + 1,        y + fm.getAscent());
        g.drawString("rating", whiteRatingTagBoxLeft  + 1, y + fm.getAscent());

        y += tagBoxHeight;
        g.drawString("black",  blackTagBoxLeft + 1,        y + fm.getAscent());
        g.drawString("rating", blackRatingTagBoxLeft  + 1, y + fm.getAscent());

        // now draw the tag boxes

        g.setColor(Color.black);

        y = scoreSheetTop;
        g.drawRect(eventTagBoxLeft, y, eventTagBoxWidth,    tagBoxHeight);
        g.drawRect(dateTagBoxLeft,  y, dateTagBoxWidth - 1, tagBoxHeight);

        y += tagBoxHeight;
        g.drawRect(siteTagBoxLeft,   y, siteTagBoxWidth,    tagBoxHeight);
        g.drawRect(roundTagBoxLeft,  y, roundTagBoxWidth,   tagBoxHeight);
        g.drawRect(resultTagBoxLeft, y, resultTagBoxWidth,  tagBoxHeight);
        g.drawRect(ecoTagBoxLeft,    y, ecoTagBoxWidth - 1, tagBoxHeight);

        y += tagBoxHeight;
        g.drawRect(whiteTagBoxLeft,        y, whiteTagBoxWidth,           tagBoxHeight);
        g.drawRect(whiteRatingTagBoxLeft,  y, whiteRatingTagBoxWidth - 1, tagBoxHeight);

        y += tagBoxHeight;
        g.drawRect(blackTagBoxLeft,        y, blackTagBoxWidth,           tagBoxHeight);
        g.drawRect(blackRatingTagBoxLeft,  y, blackRatingTagBoxWidth - 1, tagBoxHeight);

        // draw the tags values

        g.setFont(new Font("SansSerif", Font.PLAIN, 12));
        fm = g.getFontMetrics();
        g.setColor(Color.darkGray);

        y = scoreSheetTop + tagBoxHeight;
        g.drawString(currentGameTags.event,
                     eventTagBoxLeft + ((eventTagBoxWidth / 2) - (fm.stringWidth(currentGameTags.event) / 2)),
                     y - 4);
        g.drawString(currentGameTags.date,
                     dateTagBoxLeft + ((dateTagBoxWidth / 2) - (fm.stringWidth(currentGameTags.date) / 2)),
                     y - 4);

        y += tagBoxHeight;
        g.drawString(currentGameTags.site,
                     siteTagBoxLeft + ((siteTagBoxWidth / 2) - (fm.stringWidth(currentGameTags.site) / 2)),
                     y - 4);
        g.drawString(currentGameTags.round,
                     roundTagBoxLeft + ((roundTagBoxWidth / 2) - (fm.stringWidth(currentGameTags.round) / 2)),
                     y - 4);
        g.drawString(currentGameTags.result.equals("1/2-1/2") ? "1/2" : currentGameTags.result,
                     resultTagBoxLeft + ((resultTagBoxWidth / 2) - (fm.stringWidth(currentGameTags.result.equals("1/2-1/2") ? "1/2" : currentGameTags.result) / 2)),
                     y - 4);
        g.drawString(currentGameTags.ECOCode,
                     ecoTagBoxLeft + ((ecoTagBoxWidth / 2) - (fm.stringWidth(currentGameTags.ECOCode) / 2)),
                     y - 4);

        y += tagBoxHeight;
        g.drawString(currentGameTags.white,
                     whiteTagBoxLeft + ((whiteTagBoxWidth / 2) - (fm.stringWidth(currentGameTags.white) / 2)),
                     y - 4);
        g.drawString(currentGameTags.whiteRating,
                     whiteRatingTagBoxLeft + ((whiteRatingTagBoxWidth / 2) - (fm.stringWidth(currentGameTags.whiteRating) / 2)),
                     y - 4);

        y += tagBoxHeight;
        g.drawString(currentGameTags.black,
                     blackTagBoxLeft + ((blackTagBoxWidth / 2) - (fm.stringWidth(currentGameTags.black) / 2)),
                     y - 4);
        g.drawString(currentGameTags.blackRating,
                     blackRatingTagBoxLeft + ((blackRatingTagBoxWidth / 2) - (fm.stringWidth(currentGameTags.blackRating) / 2)),
                     y - 4);

        // now to the area where we'll be actually show chess moves
        // draw a horizontal line for form one "bold" line between the
        // tag headers secions and the moves section

        g.drawLine(scoreSheetLeft, scoreSheetMovesTop - 1, scoreSheetLeft + scoreSheetWidth - 1, scoreSheetMovesTop - 1);

        // draw the move boxes - vertical lines first

        y = scoreSheetMovesTop;
        g.drawLine(whitesLeftColLeft,  y, whitesLeftColLeft,  scoreSheetTop + scoreSheetHeight);
        g.drawLine(blacksLeftColLeft,  y, blacksLeftColLeft,  scoreSheetTop + scoreSheetHeight);
        g.drawLine(scoreSheetMiddle,   y, scoreSheetMiddle,   scoreSheetTop + scoreSheetHeight);
        g.drawLine(whitesRightColLeft, y, whitesRightColLeft, scoreSheetTop + scoreSheetHeight);
        g.drawLine(blacksRightColLeft, y, blacksRightColLeft, scoreSheetTop + scoreSheetHeight);

        // draw the horizontal lines and move numbers

        g.setFont(new Font("Monospaced", Font.PLAIN, 10));
        fm = g.getFontMetrics();
        g.setColor(Color.black);

        // what scoresheet page is this?

        int movesPerPage = moveLines * 4;
        int page = (scoreKeeper.getCurrentMoveIndex() - 1) / movesPerPage;

        for (int i = 1; i <= moveLines; i++)
        {
            int moveNumber;
            moveNumber = (page * (movesPerPage / 2)) + i;

            y += moveBoxHeight;
            g.drawLine(scoreSheetLeft, y, scoreSheetLeft + scoreSheetWidth - 1, y);

            // the left sid move numbers

            g.drawString(String.valueOf(moveNumber),
                         scoreSheetLeft + (boxForMoveNumsWidth / 2) - (fm.stringWidth(String.valueOf(moveNumber)) / 2),
                         y - 3);

            // the right side move numbers

            g.drawString(String.valueOf(moveNumber + moveLines),
                         scoreSheetMiddle + (boxForMoveNumsWidth / 2) - (fm.stringWidth(String.valueOf(moveNumber + moveLines)) / 2),
                         y - 3);
        }

        // if this is puzzle mode don't show the moves unless bShowAnswer == true

        if (bPuzzleMode && !bShowAnswer)
        {
            return;
        }

        // now draw the moves of the game

        g.setFont(new Font("SansSerif", Font.PLAIN, 12));
        fm = g.getFontMetrics();
        g.setColor(Color.darkGray);


        y = scoreSheetMovesTop;
        strCurrentVariation = null;
        for (int i = 0; i < movesPerPage; i++)
        {
            int moveIndex;
            moveIndex = (page * movesPerPage) + i;

            if (moveIndex >= scoreKeeper.getTotalMoves())
            {
                break;
            }

            String pgnMove = scoreKeeper.getPGNMoveAt(moveIndex);

            // if this move is the starting of a variation, make it blue

            if (scoreKeeper.isVariationAt(moveIndex + 1))
            {
                // if this is a variation on the main line - draw strCurrentVariation

                if (scoreKeeper.isMainLineVariationAt(moveIndex + 1))
                {
                    // this is the variation off the main line

                    strCurrentVariation = "Variation: " + (moveIndex + 3) / 2 + ". ";

                    if (moveIndex % 2 == 0)
                    {
                        strCurrentVariation += "... ";
                    }

                    strCurrentVariation += scoreKeeper.getPGNMoveAt(moveIndex + 1);

                    // draw the variation string if this is not the main line

                    g.setFont(new Font("Dialog", Font.BOLD, 12));
                    fm = g.getFontMetrics();
                    g.setColor(squareLightColor);

                    int x1 = ((leftMargin + boardWidth) / 2) - (fm.stringWidth(strCurrentVariation) / 2);
                    int y1 = topMargin - 8 ;
                    g.drawString(strCurrentVariation, x1, y1);

                    // reset font

                    g.setFont(new Font("SansSerif", Font.PLAIN, 12));
                    fm = g.getFontMetrics();
                }

                g.setColor(Color.blue);
            }
            else if (g.getColor() == Color.blue)
            {
                g.setColor(Color.darkGray);
            }

            // if there are variations at the next move add "*", "**", or "***"
            // to the move string - 'Bg5' might be '*Bg5', or 'Bg5**"

            int intVariations = scoreKeeper.variationsAt(moveIndex + 1);
            if (intVariations == 1)
            {
                pgnMove = pgnMove + "*";
            }
            if (intVariations == 2)
            {
                pgnMove = pgnMove + "**";
            }
            if (intVariations > 2)
            {
                pgnMove = pgnMove + "***";
            }

            // CheckForRAVS turns on and off the RAVS list

            CheckForRAVS();

			// if we started from a FEN position - black may have had the first move
			int currentIndex = scoreKeeper.blackHadFirstMove() ? i + 1 : i;

			if (currentIndex == moveLines * 2)
			{
				y = scoreSheetMovesTop;
			}

			// need to move down a line of this is the first move and black is on move (from a FEN position)
			if (scoreKeeper.blackHadFirstMove() && moveIndex == 0)
			{
				y += moveBoxHeight;			

				// draw a "..." before black's first move (in white's column)
				g.drawString("...",
					         whitesLeftColLeft + (moveBoxWidth / 2) - (fm.stringWidth("...") / 2),
					         y - 2);
			}

			// if this is the current move - make it bold
			if (moveIndex == scoreKeeper.getCurrentMoveIndex() - 1)
			{
				g.setFont(new Font("SansSerif", Font.BOLD, 12));
				fm = g.getFontMetrics();
			}
			else if (pgnMove.endsWith("err"))
			{
				g.setColor(Color.red);
			}
			else if (fm.getFont().isBold())
			{
				// else turn off the Bold if it was on

				g.setFont(new Font("SansSerif", Font.PLAIN, 12));
				fm = g.getFontMetrics();
			}

            if (currentIndex % 2 == 0)
            {
                // this is a white move
                y += moveBoxHeight;
                if (currentIndex < moveLines * 2)
                {
                    // left side of the scoresheet

                    g.drawString(pgnMove,
                                 whitesLeftColLeft + (moveBoxWidth / 2) - (fm.stringWidth(pgnMove) / 2),
                                 y - 2);
                }
                else
                {
                    // right side of the scoresheet

                    g.drawString(pgnMove,
                                 whitesRightColLeft + (moveBoxWidth / 2) - (fm.stringWidth(pgnMove) / 2),
                                 y - 2);
                }
            }
            else
            {
                // this is a black move

                if (currentIndex < moveLines * 2)
                {
                    // left side of the scoresheet

                    g.drawString(pgnMove,
                                 blacksLeftColLeft + (moveBoxWidth / 2) - (fm.stringWidth(pgnMove) / 2),
                                 y - 2);
                }
                else
                {
                    // right side of the scoresheet

                    g.drawString(pgnMove,
                                 blacksRightColLeft + (moveBoxWidth / 2) - (fm.stringWidth(pgnMove) / 2),
                                 y - 2);
                }
            }
        }
    }   

    private void updateHighlightedMove(Graphics g)
    {

        // if we're starting a new page redraw the scoresheet

        if ((scoreKeeper.getCurrentMoveIndex() - 1) % (moveLines * 4) == 0)
        {
              drawRightSpace(g);
              return;
        }

        int    iMoveIndex = scoreKeeper.getCurrentMoveIndex() -1;
        int    iLastIndex = iMoveIndex - 1;
        String pgnMove    = scoreKeeper.getPGNMoveAt(iMoveIndex);
        String pgnOldMove = scoreKeeper.getPGNMoveAt(iMoveIndex - 1);

        // if there are variations at the next move add "*", "**", or "***"
        // to the move string - 'Bg5' might be 'Bg5*', or 'Bg5**"

        int intVariations = scoreKeeper.variationsAt(iMoveIndex + 1);
        if (intVariations == 1)
        {
            pgnMove = pgnMove + "*";
        }
        if (intVariations == 2)
        {
            pgnMove = pgnMove + "**";
        }
        if (intVariations > 2)
        {
            pgnMove = pgnMove + "***";
        }

        intVariations = scoreKeeper.variationsAt(iLastIndex + 1);
        if (intVariations == 1)
        {
            pgnOldMove = pgnOldMove + "*";
        }
        if (intVariations == 2)
        {
            pgnOldMove = pgnOldMove + "**";
        }
        if (intVariations > 2)
        {
            pgnOldMove = pgnOldMove + "***";
        }

        // bump the index (for rending only) if black had the first move (FEN position)
		if (scoreKeeper.blackHadFirstMove())
		{
			iMoveIndex++;
			iLastIndex++;
		}

        // calculate y - I know this is difficult to decipher...sorry Charlie        

        int iLastMoveX    = 0;
        int iCurrentMoveX = 0;
        int iCurrentMoveY = scoreSheetMovesTop + ((((iMoveIndex % (moveLines * 2)) - (iMoveIndex % 2)) / 2) * moveBoxHeight) + moveBoxHeight;
        int iLastMoveY    = scoreSheetMovesTop + ((((iLastIndex % (moveLines * 2)) - (iLastIndex % 2)) / 2) * moveBoxHeight) + moveBoxHeight;

        // erase the old moves

        iMoveIndex = iMoveIndex % (moveLines * 4);
        iLastIndex = iLastIndex % (moveLines * 4);

        if (iMoveIndex % 2 == 0)
        {
            // this is a white move

            iCurrentMoveX = iMoveIndex < moveLines * 2 ? whitesLeftColLeft : whitesRightColLeft;
            iLastMoveX    = iLastIndex < moveLines * 2 ? blacksLeftColLeft : blacksRightColLeft;
        }
        else
        {
            // this is a black move

            iCurrentMoveX = iMoveIndex < moveLines * 2 ? blacksLeftColLeft : blacksRightColLeft;
            iLastMoveX    = iLastIndex < moveLines * 2 ? whitesLeftColLeft : whitesRightColLeft;
        }

        // remove the old highLighted move

        g.setColor(new Color(0xfffff0));
        g.fillRect(iLastMoveX + 1,  iLastMoveY - moveBoxHeight + 1, moveBoxWidth - 2, moveBoxHeight - 2);

        // draw the old move PLAIN

        g.setFont(new Font("SansSerif", Font.PLAIN, 12));
        FontMetrics fm = g.getFontMetrics();
        g.setColor(scoreKeeper.isVariationAt(scoreKeeper.getCurrentMoveIndex() - 1) ? Color.blue : Color.darkGray);
        g.drawString(pgnOldMove,
                     iLastMoveX + (moveBoxWidth / 2) - (fm.stringWidth(pgnOldMove) / 2),
                     iLastMoveY - 2);


        // erase the old move with a rectangle

        g.setColor(new Color(0xfffff0));
        g.fillRect(iCurrentMoveX + 1,  iCurrentMoveY - moveBoxHeight + 1, moveBoxWidth - 2, moveBoxHeight - 2);

        // draw the move in BOLD

        g.setFont(new Font("SansSerif", Font.BOLD, 12));
        fm = g.getFontMetrics();
        g.setColor(scoreKeeper.isVariationAt(scoreKeeper.getCurrentMoveIndex()) ? Color.blue : Color.darkGray);
        g.drawString(pgnMove,
                     iCurrentMoveX + (moveBoxWidth / 2) - (fm.stringWidth(pgnMove) / 2),
                     iCurrentMoveY - 2);

        // draw the variation string if this is not the main line

        if (strCurrentVariation != null)
        {
            g.setFont(new Font("Dialog", Font.BOLD, 12));
            fm = g.getFontMetrics();
            g.setColor(squareLightColor);

            int x1 = ((leftMargin + boardWidth) / 2) - (fm.stringWidth(strCurrentVariation) / 2);
            int y1 = topMargin - 8 ;
            g.drawString(strCurrentVariation, x1, y1);

        }

        // CheckForRAVS turns on and off the RAVS list

        CheckForRAVS();
    }

    private void drawBottomSpace(Graphics g)
    {
        // draw the scoresheet's background

        g.setColor(backgroundColor);
        g.fillRect(bottomSpaceLeft,
                   bottomSpaceTop,
                   bottomSpaceWidth,
                   bottomSpaceHeight);

        // draw a boarder around that background

        g.setColor(new Color(0x000000));
        g.drawRect(bottomSpaceLeft,
                   bottomSpaceTop,
                   bottomSpaceWidth  - 1,
                   bottomSpaceHeight - 1);

        // draw the game list if we are reading a PGN file

        int pgnGameListX = bottomSpaceLeft + 4;
        int pgnGameListY = bottomSpaceTop  + 4;

        // draw "www.MyChess.com" - my credit
        g.setFont(new Font("Dialog", Font.PLAIN, 13));
        FontMetrics fm = g.getFontMetrics();
        String strMyCredit;
        if (bWidget) {
        	strMyCredit = new String("Ozone channel: mychess");
        }
        else {
        	strMyCredit = new String("www.mychess.com");        	
        }

        g.setColor(squareLightColor);
        g.drawString(strMyCredit,
                     rightSpaceLeft + (rightSpaceWidth / 2) - (fm.stringWidth(strMyCredit) / 2),
                     bottomSpaceTop + bottomSpaceHeight - (fm.getHeight() / 2));

        if (bInitError)
        {
            drawErrorMessage(g, strInitErrorMessage,
                             bottomSpaceLeft + (bottomSpaceWidth  / 2),
                             bottomSpaceTop  + (bottomSpaceHeight / 2));
            return;
        }
        else if (showPGNGameList)
        {
            // do we need to add the game list to this container (applet)?

            if (pgnGameList != null &&
                getComponentAt(pgnGameListX, pgnGameListY) != pgnGameList)
            {
                add(pgnGameList);
                pgnGameList.setBounds(pgnGameListX,
                                      pgnGameListY,
                                      boardWidth - 8,
                                      bottomSpaceHeight - 8);

                pgnGameList.setVisible(true);
            }
        }

        // draw our buttons that control game viewing

              int buttonWidth  = 40;
        final int buttonHeight = 20;
        final int nextButtonX  = buttonWidth + 5;
        final int nextButtonY  = buttonHeight + 10;
        int       buttonLeft   = rightSpaceLeft + (rightSpaceWidth / 2)   - ((buttonWidth + (nextButtonX * 3)) / 2);
        int       buttonTop    = bottomSpaceTop + 5;

        if (getComponentAt(buttonLeft, buttonTop) != pgnButtonStart)
        {
            pgnButtonNext     = new Button(">");
            pgnButtonPrev     = new Button("<");
            pgnButtonStart    = new Button("<<");
            pgnButtonEnd      = new Button(">>");
            preferencesButton = new Button("Preferences");
            btnShowAnswer     = new Button("Show Answer");
            pgnButtonNext.addActionListener(this);
            pgnButtonPrev.addActionListener(this);
            pgnButtonStart.addActionListener(this);
            pgnButtonEnd.addActionListener(this);
            preferencesButton.addActionListener(this);
            btnShowAnswer.addActionListener(this);
            add(pgnButtonStart);
            add(pgnButtonPrev);
            add(pgnButtonNext);
            add(pgnButtonEnd);
            add(preferencesButton);
            add(btnShowAnswer);
            pgnButtonStart.setBounds(buttonLeft, buttonTop, buttonWidth, buttonHeight);
            buttonLeft += nextButtonX;
            pgnButtonPrev.setBounds (buttonLeft, buttonTop, buttonWidth, buttonHeight);
            buttonLeft += nextButtonX;
            pgnButtonNext.setBounds (buttonLeft, buttonTop, buttonWidth, buttonHeight);
            buttonLeft += nextButtonX;
            pgnButtonEnd.setBounds  (buttonLeft, buttonTop, buttonWidth, buttonHeight);

            buttonWidth = 100;
            buttonLeft  = rightSpaceLeft + (rightSpaceWidth / 2) - (buttonWidth / 2);
            buttonTop  += nextButtonY;
            preferencesButton.setBounds(buttonLeft, buttonTop, buttonWidth, buttonHeight);

            // set the size and location of the RAV list
            // the verticle location was set in drawBottonSpace

            int X = rightSpaceLeft + (rightSpaceWidth / 2) - (RAVList.getSize().width / 2);
            int Y = buttonTop + buttonHeight + 8;
            RAVList.setLocation(X, Y);

            if (bPuzzleMode)
            {
                buttonTop  += nextButtonY;
                btnShowAnswer.setBounds(buttonLeft, buttonTop, buttonWidth, buttonHeight);
            }
            else
            {
                btnShowAnswer.setVisible(false);
            }
        }

        // do we need to display who is on move - as in puzzle mode?

        if (bShowSideOnMove)
        {
            g.setFont(new Font("Dialog", Font.BOLD, 12));
            fm = g.getFontMetrics();
            g.setColor(squareLightColor);

            String strOnMove = bWhiteToMove ? "White to Move" : "Black to Move";

            int X = rightSpaceLeft + (rightSpaceWidth / 2) - (fm.stringWidth(strOnMove) / 2);
            int Y = btnShowAnswer.isVisible() ? btnShowAnswer.getLocation().y + fm.getHeight() + buttonHeight + 2
                                              : preferencesButton.getLocation().y + fm.getHeight() + buttonHeight + 2;

            g.drawString(strOnMove, X, Y);
        }
    }

    private void drawPiece(Graphics g, char piece, int x, int y)
    {
        switch (piece)
        {
            case 'P':

                g.drawImage(wPawnImage, x, y, this);
                break;

            case 'N':

                g.drawImage(wKnightImage, x, y, this);
                break;

            case 'B':

                g.drawImage(wBishopImage, x, y, this);
                break;

            case 'R':

                g.drawImage(wRookImage, x, y, this);
                break;

            case 'Q':

                g.drawImage(wQueenImage, x, y, this);
                break;

            case 'K':

                g.drawImage(wKingImage, x, y, this);
                break;

            case 'p':

                g.drawImage(bPawnImage, x, y, this);
                break;

            case 'n':

                g.drawImage(bKnightImage, x, y, this);
                break;

            case 'b':

                g.drawImage(bBishopImage, x, y, this);
                break;

            case 'r':

                g.drawImage(bRookImage, x, y, this);
                break;

            case 'q':

                g.drawImage(bQueenImage, x, y, this);
                break;

            case 'k':

                g.drawImage(bKingImage, x, y, this);
                break;

            default:

                break;
        }
    }

    /*
     *    This draws a "MessageBox" with the given foreground
     *    and background.  It will be draw so that the given x, y
     *    coordinate is the center of the box.  strMessage can be
     *    several lines separated be the newline character '\n'.
     *    The box is auto-sized around strMessage.
     **/

    private void drawMessageBox(Graphics g,
                                String strMessage,
                                Color foreground,
                                Color background,
                                int x,
                                int y)
    {
        // first, get the lines in our error message as 'tokens'

        StringTokenizer st = new StringTokenizer(strMessage, "\n");

        // set the font

        g.setFont(new Font("Dialog", Font.PLAIN, 12));
        FontMetrics fm = g.getFontMetrics();

        // get the dimension of the message box

        int iBoxHeight = fm.getHeight() * (st.countTokens() + 2);
        int iBoxWidth = 0;

        while (st.hasMoreTokens())
        {
            // find the longest string

            String strLine = st.nextToken();

            if (fm.stringWidth(strLine) > iBoxWidth - 40)
            {
                iBoxWidth = fm.stringWidth(strLine) + 40;
            }
        }

        // make the given x, y point the center of the message box

        x -= iBoxWidth / 2;
        y -= iBoxHeight / 2;

        // draw the box background with a black border

        g.setColor(background);
        g.fillRect(x,
                   y,
                   iBoxWidth,
                   iBoxHeight);

        g.setColor(Color.black);
        g.drawRect(x,
                   y,
                   iBoxWidth,
                   iBoxHeight);

        // now draw the message text

        int iTextX;
        int iTextY = y + fm.getAscent();
        st = new StringTokenizer(strMessage, "\n");

        g.setColor(foreground);
        while (st.hasMoreTokens())
        {
            String strLine = st.nextToken();

            iTextX  = x + ((iBoxWidth / 2) - (fm.stringWidth(strLine) / 2));
            iTextY += fm.getHeight();

            g.drawString(strLine, iTextX, iTextY);
        }
    }

    /*
     *    This draws an error "MessageBox" with a red background and
     *    a black forground.  It will be draw so that the given x, y
     *    coordinate is the center of the box.  strMessage can be
     *    several lines separated be the newline character '\n'.  The box
     *    is automatically sized around strMessage.
     **/

    private void drawErrorMessage(Graphics g, String strMessage, int x, int y)
    {

        drawMessageBox(g,
                       strMessage,
                       Color.black,
                       Color.red,
                       x,
                       y);
    }

	public void mouseMoved(MouseEvent e)
    {
    }

    public void mouseDragged(MouseEvent e)
    {
        // have we picked up a piece? return if not

        if (squarePressed == -1)
        {
            return;
        }

        // make sure we draw source square empty

        scoreKeeper.getCurrentPosition()[squarePressed] = '-';

        // calculated the curent x, y of draggedPiece

        draggedPieceX = e.getX() - draggedPieceToMouseX;
        draggedPieceY = e.getY() - draggedPieceToMouseY;

        // repaint!

        repaint();
    }

    public void mouseClicked(MouseEvent e)
    {
    }

    public void mouseEntered(MouseEvent e)
    {
    }

    public void mouseExited(MouseEvent e)
    {
    }

    public void mousePressed(MouseEvent e)
    {
        // first, are we clicking on a scoresheet move?

        int moveIndex = xyToScoreSheetMoveBox(e.getX(), e.getY());
        if (moveIndex != -1)
        {
            scoreKeeper.gotoPosition(moveIndex);
            repaint();
            return;
        }

        // if dragging is off, just return

        if (!isDraggingOn)
        {
            return;
        }

        // make sure we're not already dragging a piece around
        // it is possible to press another button during dragging

        if (squarePressed != -1)
        {
            return;
        }

        squarePressed = xyToSquareNumber(e.getX(), e.getY());

        // are we on a valid chess square?

        if (squarePressed == -1)
        {
            return;
        }

        // are we pressing an empty square?

        if (scoreKeeper.getCurrentPosition()[squarePressed] == '-')
        {
            squarePressed = -1;
            return;
        }

        // this is the piece we'll be dragging

        draggedPiece  = scoreKeeper.getCurrentPosition()[squarePressed];

        // calculate the the x, y coordinate of the dragged piece

        int file, rank;
        if (whiteFromBottom)
        {
            file = (squarePressed + 8) % 8;
            rank = squarePressed  / 8;
        }
        else
        {
            file = (63 - squarePressed + 8) % 8;
            rank = (63 - squarePressed) / 8;
        }

        int pieceWidth    = wPawnImage.getWidth(this);
        int pieceHeight   = wPawnImage.getHeight(this);
        int pieceOffsetX  = (squareWidth / 2) - (pieceWidth / 2);
        int pieceOffsetY  = squareHeight - pieceHeight;

        draggedPieceX = leftMargin + (file * squareWidth)  + pieceOffsetX;
        draggedPieceY = topMargin  + (rank * squareHeight) + pieceOffsetY;

        // now, calculate to relative distance from the mouse's
        // current x, y to draggedPiece's current x,y

        draggedPieceToMouseX = e.getX() - draggedPieceX;
        draggedPieceToMouseY = e.getY() - draggedPieceY;
    }

    public void mouseReleased(MouseEvent e)
    {
         // TEMPORARY: just return the piece

         if (squarePressed != -1)
         {
             scoreKeeper.getCurrentPosition()[squarePressed] = draggedPiece;
             squarePressed = -1;
         }

         repaint();
    }

    /**
     *     This method converts an x, y coordinate
     *     (from a mouse most likely) to a square number.  This
     *     number can then be used to locate the piece a user is
     *     attempting to pick up (or the square to drop a piece off)
     *     by indexing into currentPosition.
     */

    private int xyToSquareNumber(int x, int y)
    {
        // are we on a valid chess square?

        if (x < leftMargin || x > leftMargin + (squareWidth  * 8) ||
            y < topMargin  || y > topMargin  + (squareHeight * 8))
        {
            return -1;
        }

        // now calulate the square number

        int squaresToTheRight  = (x - leftMargin) / squareWidth;
        int squaresToTheBottom = (y - topMargin ) / squareHeight;
        int squareNum = squaresToTheBottom * 8 + squaresToTheRight;

        return whiteFromBottom ? squareNum : 63 - squareNum;
    }

    /**
     *    This method finds the point location (left, top) of
     *    the given square number.
     */

    private Point squareNumberToPoint(int square)
    {
        int workSquare = !whiteFromBottom ? Math.abs(square - 63) : square;
        int file       = workSquare % 8;
        int rank       = workSquare / 8;
        int x          = leftMargin + (file * squareWidth);
        int y          = topMargin  + (rank * squareHeight);

        return new Point(x, y);
    }

    /**
     *     This method converts an x, y coordinate
     *     (from a mouse most likely) to a scoresheet move box.  This
     *     number will the correspond to that move's index in the
     *     scoreKeeper.
     */

    private int xyToScoreSheetMoveBox(int x, int y)
    {
        // are we on a valid scoresheet move box?

        if (x < scoreSheetLeft     || x > scoreSheetRight ||
            y < scoreSheetMovesTop || y > scoreSheetMovesTop + (moveLines * moveBoxHeight))
        {
            return -1;
        }

        // now calulate the move box number (or index)

        int boxIndex = (((y - scoreSheetMovesTop) / moveBoxHeight) * 2) + 1;

        if (x > blacksRightColLeft)
        {
            boxIndex += (moveLines * 2) + 1;
        }
        else if (x > scoreSheetMiddle)
        {
            boxIndex += moveLines * 2;
        }
        else if (x > blacksLeftColLeft)
        {
            boxIndex++;
        }

        // now figure out what page where currently on and adjuct
        // the index accordingly

        int movesPerPage = moveLines * 4;
        int page = (scoreKeeper.getCurrentMoveIndex() - 1) / movesPerPage;

        boxIndex += (page * movesPerPage);

		// did black have the first move on a FEN position?
		if (scoreKeeper.blackHadFirstMove())
		{
			boxIndex--;
		}

        // make sure we're not beyond the last move

        if (boxIndex > scoreKeeper.getTotalMoves())
        {
            return -1;
        }

        return boxIndex;
    }

    private void AnimateNextMove()
    {
        // wait for the previous animation to finish if the user
        // is wildly clicking the nextMove button

        if (animationThread == null || !animationThread.isAlive())
        {
            ChessMove cm = scoreKeeper.getCurrentChessMove();

            isAnimation          = true;
            animatedSourceSquare = cm.getSourceSquare();
            animatedDestSquare   = cm.getDestSquare();
            animationPosition    = (char[])scoreKeeper.getCurrentPosition().clone();
            animatedPiece        = animationPosition[animatedSourceSquare];
            animationPosition[animatedSourceSquare] = '-';

            scoreKeeper.gotoPosition(scoreKeeper.getCurrentMoveIndex() + 1);

            animationThread = new Thread(this, "Animation");
            animationThread.start();
        }
    }

    // this processes our applets buttons

    public void actionPerformed(ActionEvent e)
    {
        Object object = e.getSource();

        if (object == pgnButtonNext &&
            scoreKeeper.getCurrentMoveIndex() < scoreKeeper.getTotalMoves() - 1)
        {
        	broadcastMove();
            if (bAnimateMoves)
            {
                AnimateNextMove();
            }
            else
            {
                scoreKeeper.gotoPosition(scoreKeeper.getCurrentMoveIndex() + 1);
                repaint();
            }
            storeCurrentPosition();
        }
        else if (object == pgnButtonPrev &&
                 scoreKeeper.getCurrentMoveIndex() > 0)

        {
            scoreKeeper.gotoPosition(scoreKeeper.getCurrentMoveIndex() - 1);
            repaint();
            storeCurrentPosition();
        }
        else if (object == pgnButtonStart)
        {
            scoreKeeper.gotoPosition(0);
            repaint();
            storeCurrentPosition();
        }
        else if (object == pgnButtonEnd)
        {
            if (bPuzzleMode && !bShowAnswer)
            {
                bShowAnswer     = true;
                bShowSideOnMove = false;
                btnShowAnswer.setVisible(false);
            }

            scoreKeeper.gotoPosition(scoreKeeper.getTotalMoves() - 1);
            repaint();
            storeCurrentPosition();
        }
        else if (object == preferencesButton)
        {
            Point p = preferencesButton.getLocation();
            preferencesMenu.show(this, p.x, p.y + 20);
        }
        else if (object == btnShowAnswer)
        {
            bShowAnswer     = true;
            bShowSideOnMove = false;
            btnShowAnswer.setVisible(false);
            repaint();
        }
        else if (object == miFlipBoard)
        {
            whiteFromBottom = whiteFromBottom ? false : true;
            repaint();
        }
        else if (object == miAnimateMoves)
        {
            if (bAnimateMoves)
            {
                bAnimateMoves = false;
                miAnimateMoves.setLabel("Turn Animation On");
            }
            else
            {
                bAnimateMoves = true;
                miAnimateMoves.setLabel("Turn Animation Off");
            }
        }
        else if (object == miShowGamesList)
        {
            if (pgnGameList.isVisible())
            {
                showPGNGameList = false;
                pgnGameList.setVisible(false);
                miShowGamesList.setLabel("Show Games List");
            }
            else
            {
                showPGNGameList = true;
                commentWindow.setVisible(false);
                pgnGameList.setVisible(true);
                miShowGamesList.setLabel("Hide Games List");
            }
        }
    }

    public void itemStateChanged(ItemEvent e)
    {
        Object object = e.getSource();

        if (object == pgnGameList)
        {
			intLastRAVMoveIndex = 10000;
			readPGNGame(pgnGameList.getSelectedIndex(), false);
            repaint();

            if (bPuzzleMode)
            {
                btnShowAnswer.setVisible(true);
                bShowAnswer = false;
                RAVList.setVisible(false);
            }
        }
        else if (object == RAVList)
        {
            scoreKeeper.setLine(RAVList.getSelectedIndex());
            repaint();
        }
    }

    /**
     * Call JavaScript function to broadcast move information.
     */
    public void broadcastMove()
    {
        if (bWidget) {
	    	ChessMove cm = scoreKeeper.getCurrentChessMove();
	    	
	    	// Get a handle to the current HTML document Window
	    	// object.
	        netscape.javascript.JSObject win = JSObject.getWindow(this);
	        
	        // Call JavaScript function with arguments.
	        Object args[] = {cm.getLongAlg()};
	        win.call("broadcastMove", args);    	
        }
    }
    
    /**
     * Call JavaScript function to store the current game position
     * to the Preferences server.
     */
    public void storeCurrentPosition()
    {
        if (bWidget) {
        	
	    	// Get a handle to the current HTML document Window
	    	// object.
	        netscape.javascript.JSObject win = JSObject.getWindow(this);
	        
	        // Call JavaScript function with arguments.
	        Object args[] = {new Integer(scoreKeeper.getCurrentMoveIndex())};
	        win.call("storePosition", args);    	
        }
    }
    
    /**
     * Retrieve the current game position from the JavaScript
     * environment.
     * 
     * @return int denoting current game position
     */
    public int getCurrentPosition()
    {
    	int result = 0;
        if (bWidget) {
        	
	    	// Get a handle to the current HTML document Window
	    	// object.
	        netscape.javascript.JSObject win = JSObject.getWindow(this);
	        
	        // Get the value directly from the variable (numbers are
	        // typically represented as floating point).
	        result = new Double(win.getMember("gamePosition").toString()).intValue();
        }
        return result;
    }

    // window listeners

    public void windowActivated(WindowEvent e)
    {
    }
    public void windowDeactivated(WindowEvent e)
    {
    }
    public void windowClosed(WindowEvent e)
    {
    }
    public void windowClosing(WindowEvent e)
    {
        bWindowClosed = true;
    }
    public void windowOpened(WindowEvent e)
    {
    }
    public void windowIconified(WindowEvent e)
    {
    }
    public void windowDeiconified(WindowEvent e)
    {
    }
}

class PgnGameTags implements Cloneable
{
    String event;
    String site;
    String date;
    String round;
    String white;
    String black;
    String whiteRating;
    String blackRating;
    String result;
    String ECOCode;
    String FEN;

    // override Object.clone

    public Object clone()
    {
        try
        {
            return super.clone();
        }
        catch (CloneNotSupportedException e)
        {
            throw new InternalError();
        }
    }
}