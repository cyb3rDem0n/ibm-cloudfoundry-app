#Giuseppe D'Agostino - all right reserverd
printf "\ncyb3rDem0n - all right reserverd\n"

cf_building_op(){

	#flag var
	c="false"

	printf "\n------------- START --------------------------------------------------\n"
	
	
	if [ $1 = 'prd' ];
	then 
		printf "\n==> You're in PRODUCTION ENV\n\nNothing to do here yet, try to implement some shit" 
		c="true"
	
	else 
		c="false"
			printf "\nX  NOT in PROD"
	fi

	if [ $1 = 'dev' ];
	then 
		c="true"	
		printf "\n==> You're in DEVELOPMENT ENV"
		
		cf -version
		
		printf "\n\n-------------CLOUD FOUNDRY START---------------------------------------------\n"
		
		printf "\n\n-------------api setting-----------------------------------------------------\n"
		cf api https://api.eu-gb.bluemix.net
		
		printf "\nPlease enter the IBM cloud username"
		read username
		printf "\nPlease enter the IBM cloud password"
		read password
		
		printf "\n\n-------------login-----------------------------------------------------------\n"
		cf login -u "$username" -p "$password" -o dagostinogiuseppe@outlook.com -s dev
		
		printf "\n\n-------------status----------------------------------------------------------\n"
		cf app nodejs-cloudfoundy-demo	
				 
		printf "\n\n-------------pushing on someone else's computer----------------------------------------------------------\n"
		cf app nodejs-cloudfoundy-demo
		printf "\n"
		cf push nodejs-cloudfoundy-demo

		printf "\n-------------CLOUD FOUNDRY FINISH----------------------------------------------\n"
		
		else 
		printf "\nX  NOT in DEV"
	fi

	if [ $c = 'false' ];
	then
		printf "\n\nwrong parameter"
	else
	
		printf "\n\nScript executed sucessfully in $1 environment\n"
		printf "\n------------- FINISH ---------------------------------------------\n"

	fi
}

usage="$(basename "$0") [-h] [-s n] 

 * Copyright    : Copyright (c) 2018 cyb3rDem0n.  All rights reserved.
 *                This source code constitutes the unpublished,
 *                confidential and proprietary information of Giuseppe D'Agostino.
 *				  refer to : dagostinogiuseppe@outlook.com	
 *
 * Created by   : cyb3rDem0n - Giuseppe D'Agostino - Italy.
 *
 * For more details see repository web documentation for the project
 
--> This script perform deploy op. on Cloud Foundry using a specific environment. Please read the usage.

Usage:
    -h  show this help text
    -s  set the environment, env: dev, test"

while getopts ':hs:' option; do
  case "$option" in
    h) echo "$usage"
       exit
       ;;
    s) cf_building_op $OPTARG
       ;;
    :) printf "missing argument for -%s\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
   \?) printf "illegal option: -%s\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
  esac
done
shift $((OPTIND - 1))